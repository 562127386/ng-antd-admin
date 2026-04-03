import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NonConformingDto, CreateUpdateNonConformingDto, GetNonConformingListDto, CompleteReviewInput, CompleteDisposalInput } from '../models/non-conforming.model';
import { NonConformingService } from '../services/non-conforming.service';
import { NonConformingStatus, ReviewResult, DefectSeverity, InspectionType, InspectionResult } from '../models/enums';

@Component({
  selector: 'app-non-conformings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzInputNumberModule,
    NzDividerModule,
    NzTagModule,
    NzDescriptionsModule,
    NzAlertModule
  ],
  templateUrl: './non-conformings.component.html',
  styleUrls: ['./non-conformings.component.less']
})
export class NonConformingsComponent implements OnInit {
  private nonConformingService = inject(NonConformingService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  data: NonConformingDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  createForm!: FormGroup;
  reviewForm!: FormGroup;
  disposalForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  isViewMode = false;
  isReviewMode = false;
  isDisposalMode = false;
  editId?: string;
  viewingItem?: NonConformingDto;

  statusOptions = [
    { label: '待审核', value: NonConformingStatus.PendingReview, color: 'default' },
    { label: '审核中', value: NonConformingStatus.Reviewing, color: 'processing' },
    { label: '待处理', value: NonConformingStatus.PendingDisposal, color: 'warning' },
    { label: '处理中', value: NonConformingStatus.Disposing, color: 'processing' },
    { label: '已完成', value: NonConformingStatus.Completed, color: 'success' }
  ];

  sourceModuleOptions = [
    { label: 'IQC', value: InspectionType.IQC },
    { label: 'IPQC', value: InspectionType.IPQC },
    { label: 'FQC', value: InspectionType.FQC },
    { label: 'OQC', value: InspectionType.OQC }
  ];

  severityOptions = [
    { label: '轻微', value: DefectSeverity.Minor, color: 'default' },
    { label: '一般', value: DefectSeverity.Moderate, color: 'warning' },
    { label: '严重', value: DefectSeverity.Major, color: 'error' },
    { label: '致命', value: DefectSeverity.Critical, color: 'red' }
  ];

  reviewResultOptions = [
    { label: '返工', value: ReviewResult.Rework },
    { label: '返修', value: ReviewResult.Repair },
    { label: '让步', value: ReviewResult.Concession },
    { label: '报废', value: ReviewResult.Scrap }
  ];

  inspectionResultOptions = [
   // { label: '待判定', value: 0 },
    { label: '合格', value: InspectionResult.Accepted },
    { label: '不合格', value: InspectionResult.Rejected },
    { label: '特采', value: InspectionResult.Concession },
    { label: '挑选', value: InspectionResult.Sorting, color: 'processing' }
  ];

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      status: [null],
      sourceModule: [null]
    });

    this.createForm = this.fb.group({
      sourceModule: [null, [Validators.required]],
      relatedOrderNo: ['', [Validators.required]],
      materialCode: ['', [Validators.required]],
      batchNo: [''],
      quantity: [null, [Validators.required, Validators.min(0)]],
      defectiveQuantity: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      defectCode: [''],
      severity: [null, [Validators.required]]
    });

    this.reviewForm = this.fb.group({
      reviewResult: [null, [Validators.required]],
      reworkQty: [null, [Validators.min(0)]],
      repairQty: [null, [Validators.min(0)]],
      scrapQty: [null, [Validators.min(0)]],
      responsiblePerson: [''],
      responsibleDept: [''],
      responsibleSupplier: ['']
    });

    this.disposalForm = this.fb.group({
      reInspectionResult: [null]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetNonConformingListDto = {
      filter: this.filterForm.value.filter,
      status: this.filterForm.value.status,
      sourceModule: this.filterForm.value.sourceModule,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.nonConformingService.getList(input).subscribe({
      next: (result) => {
        this.data = result.items;
        this.total = result.totalCount;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.messageService.error('加载数据失败');
      }
    });
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset(): void {
    this.filterForm.reset();
    this.pageIndex = 1;
    this.loadData();
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadData();
  }

  showAddModal(): void {
    this.isEdit = false;
    this.isViewMode = false;
    this.isReviewMode = false;
    this.isDisposalMode = false;
    this.editId = undefined;
    this.viewingItem = undefined;
    this.createForm.reset();
    this.isModalVisible = true;
  }

  showEditModal(item: NonConformingDto): void {
    if (item.status !== NonConformingStatus.PendingReview) {
      this.messageService.warning('只有待审核状态的单据可以编辑');
      return;
    }
    this.isEdit = true;
    this.isViewMode = false;
    this.isReviewMode = false;
    this.isDisposalMode = false;
    this.editId = item.id;
    this.viewingItem = item;
    this.createForm.patchValue({
      sourceModule: item.sourceModule,
      relatedOrderNo: item.relatedOrderNo,
      materialCode: item.materialCode,
      batchNo: item.batchNo,
      quantity: item.quantity,
      defectiveQuantity: item.defectiveQuantity,
      description: item.description,
      defectCode: item.defectCode,
      severity: item.severity
    });
    this.isModalVisible = true;
  }

  showViewModal(item: NonConformingDto): void {
    this.isEdit = false;
    this.isViewMode = true;
    this.isReviewMode = false;
    this.isDisposalMode = false;
    this.editId = undefined;
    this.viewingItem = item;
    this.isModalVisible = true;
  }

  showReviewModal(item: NonConformingDto): void {
    if (item.status !== NonConformingStatus.PendingReview && item.status !== NonConformingStatus.Reviewing) {
      this.messageService.warning('只有待审核或审核中状态的单据可以审核');
      return;
    }
    this.isEdit = false;
    this.isViewMode = false;
    this.isReviewMode = true;
    this.isDisposalMode = false;
    this.editId = item.id;
    this.viewingItem = item;
    this.reviewForm.reset();
    // 如果已经是审核中状态，填充已有数据
    if (item.status === NonConformingStatus.Reviewing) {
      this.reviewForm.patchValue({
        reviewResult: item.reviewResult,
        reworkQty: item.reworkQty,
        repairQty: item.repairQty,
        scrapQty: item.scrapQty,
        responsiblePerson: item.responsiblePerson,
        responsibleDept: item.responsibleDept,
        responsibleSupplier: item.responsibleSupplier
      });
    }
    this.isModalVisible = true;
  }

  showDisposalModal(item: NonConformingDto): void {
    if (item.status !== NonConformingStatus.PendingDisposal && item.status !== NonConformingStatus.Disposing) {
      this.messageService.warning('只有待处理或处理中状态的单据可以处理');
      return;
    }
    this.isEdit = false;
    this.isViewMode = false;
    this.isReviewMode = false;
    this.isDisposalMode = true;
    this.editId = item.id;
    this.viewingItem = item;
    this.disposalForm.reset();
    // 如果已经是处理中状态，填充已有数据
    if (item.status === NonConformingStatus.Disposing) {
      this.disposalForm.patchValue({
        reInspectionResult: item.reInspectionResult
      });
    }
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.isEdit = false;
    this.isViewMode = false;
    this.isReviewMode = false;
    this.isDisposalMode = false;
    this.viewingItem = undefined;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    if (this.isReviewMode) {
      this.handleReview();
    } else if (this.isDisposalMode) {
      this.handleDisposal();
    } else if (this.viewingItem && !this.isEdit) {
      this.isModalVisible = false;
      this.viewingItem = undefined;
      this.cdr.markForCheck();
    } else {
      this.handleSave();
    }
  }

  handleSave(): void {
    if (this.createForm.invalid) {
      Object.values(this.createForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const input: CreateUpdateNonConformingDto = this.createForm.value;

    if (this.isEdit && this.editId) {
      this.nonConformingService.update(this.editId, input).subscribe({
        next: () => {
          this.messageService.success('更新成功');
          this.isModalVisible = false;
          this.cdr.markForCheck();
          this.loadData();
        },
        error: (err) => {
          console.error('Update error:', err);
          this.messageService.error('更新失败');
        }
      });
    } else {
      this.nonConformingService.create(input).subscribe({
        next: () => {
          this.messageService.success('创建成功');
          this.isModalVisible = false;
          this.cdr.markForCheck();
          this.loadData();
        },
        error: (err) => {
          console.error('Create error:', err);
          this.messageService.error('创建失败');
        }
      });
    }
  }

  handleReview(): void {
    if (!this.editId) return;

    //注释下面一段  没有开始审核这个动作
    // if (this.viewingItem?.status === NonConformingStatus.PendingReview) {
    //   this.nonConformingService.startReview(this.editId).subscribe({
    //     next: () => {
    //       this.messageService.success('开始审核成功');
    //       this.isModalVisible = false;
    //       this.cdr.markForCheck();
    //       this.loadData();
    //     },
    //     error: () => {
    //       this.messageService.error('开始审核失败');
    //     }
    //   });
    //   return;
    // }

    if (this.reviewForm.invalid) {
      Object.values(this.reviewForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const input: CompleteReviewInput = this.reviewForm.value;
    this.nonConformingService.completeReview(this.editId, input).subscribe({
      next: () => {
        this.messageService.success('审核完成');
        this.isModalVisible = false;
        this.cdr.markForCheck();
        this.loadData();
      },
      error: () => {
        this.messageService.error('审核失败');
      }
    });
  }

  handleDisposal(): void {
    if (!this.editId) return;

    ////注释下面一段  没有开始审核这个动作
    // if (this.viewingItem?.status === NonConformingStatus.PendingDisposal) {
    //   this.nonConformingService.startDisposal(this.editId).subscribe({
    //     next: () => {
    //       this.messageService.success('开始处理成功');
    //       this.isModalVisible = false;
    //       this.cdr.markForCheck();
    //       this.loadData();
    //     },
    //     error: () => {
    //       this.messageService.error('开始处理失败');
    //     }
    //   });
    //   return;
    // }

    const input: CompleteDisposalInput = this.disposalForm.value;
    this.nonConformingService.completeDisposal(this.editId, input).subscribe({
      next: () => {
        this.messageService.success('处理完成');
        this.isModalVisible = false;
        this.cdr.markForCheck();
        this.loadData();
      },
      error: () => {
        this.messageService.error('处理失败');
      }
    });
  }

  showDeleteConfirm(id: string): void {
    this.nonConformingService.delete(id).subscribe({
      next: () => {
        this.messageService.success('删除成功');
        this.cdr.markForCheck();
        this.loadData();
      },
      error: () => {
        this.messageService.error('删除失败');
      }
    });
  }

  getStatusText(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : '';
  }

  getStatusColor(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.color : 'default';
  }

  getSourceModuleText(source: number): string {
    const option = this.sourceModuleOptions.find(o => o.value === source);
    return option ? option.label : '';
  }

  getSeverityText(severity: number): string {
    const option = this.severityOptions.find(o => o.value === severity);
    return option ? option.label : '';
  }

  getSeverityColor(severity: number): string {
    const option = this.severityOptions.find(o => o.value === severity);
    return option ? option.color : 'default';
  }

  getReviewResultText(result?: number): string {
    if (result === undefined || result === null) return '-';
    const option = this.reviewResultOptions.find(o => o.value === result);
    return option ? option.label : '-';
  }

  getInspectionResultText(result?: number): string {
    if (result === undefined || result === null) return '-';
    const option = this.inspectionResultOptions.find(o => o.value === result);
    return option ? option.label : '-';
  }

  canEdit(status: number): boolean {
    return status === NonConformingStatus.PendingReview;
  }

  canDelete(status: number): boolean {
    return status === NonConformingStatus.PendingReview;
  }

  canReview(status: number): boolean {
    return status === NonConformingStatus.PendingReview || status === NonConformingStatus.Reviewing;
  }

  canDispose(status: number): boolean {
    return status === NonConformingStatus.PendingDisposal || status === NonConformingStatus.Disposing;
  }
}
