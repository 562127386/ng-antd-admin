import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { 
  InspectionStandardDto, 
  CreateUpdateInspectionStandardDto, 
  GetInspectionStandardListDto,
  CreateUpdateInspectionItemDto
} from '../models/inspection-standard.model';
import { InspectionStandardService } from '../services/inspection-standard.service';

@Component({
  selector: 'app-inspection-standards',
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
    NzDatePickerModule,
    NzSwitchModule,
    NzTagModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzInputNumberModule,
    NzDividerModule
  ],
  templateUrl: './inspection-standards.component.html',
  styleUrls: ['./inspection-standards.component.less']
})
export class InspectionStandardsComponent implements OnInit {
  private inspectionStandardService = inject(InspectionStandardService);
  private fb = inject(FormBuilder);
  private modalService = inject(NzModalService);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  data: InspectionStandardDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  editId?: string;

  inspectionTypeOptions = [
    { label: 'IQC', value: 1 },
    { label: 'IPQC', value: 2 },
    { label: 'FQC', value: 3 },
    { label: 'OQC', value: 4 }
  ];

  samplingSchemeTypeOptions = [
    { label: 'AQL', value: 1 },
    { label: 'C=0', value: 2 },
    { label: '计量型', value: 3 },
    { label: '连续生产', value: 4 },
    { label: '跳批', value: 5 }
  ];

  inspectionMethodOptions = [
    { label: '计量', value: 1 },
    { label: '计数', value: 2 }
  ];

  statusOptions = [
    { label: '草稿', value: 1 },
    { label: '生效中', value: 2 },
    { label: '已失效', value: 3 }
  ];

  get itemsFormArray(): FormArray {
    return this.searchForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      status: [null]
    });

    this.searchForm = this.fb.group({
      code: ['', [Validators.required]],
      version: ['', [Validators.required]],
      effectiveDate: [null, [Validators.required]],
      expiryDate: [null],
      inspectionType: [null, [Validators.required]],
      samplingSchemeType: [null, [Validators.required]],
      samplingSchemeConfig: [''],
      items: this.fb.array([])
    });
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      inspectionMethod: [null, [Validators.required]],
      standardValue: [null],
      usl: [null],
      ucl: [null],
      lcl: [null],
      lsl: [null],
      tool: [''],
      methodDescription: [''],
      frequency: [''],
      isCritical: [false],
      defectSeverity: [null],
      defectCode: [''],
      sortOrder: [0, [Validators.required]]
    });
  }

  addItem(): void {
    this.itemsFormArray.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetInspectionStandardListDto = {
      filter: this.filterForm.value.filter,
      status: this.filterForm.value.status,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.inspectionStandardService.getList(input).subscribe({
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
    this.editId = undefined;
    this.searchForm.reset();
    this.itemsFormArray.clear();
    this.isModalVisible = true;
  }

  showEditModal(item: InspectionStandardDto): void {
    this.isEdit = true;
    this.editId = item.id;
    
    this.itemsFormArray.clear();
    if (item.items) {
      item.items.forEach(i => {
        const itemGroup = this.createItemFormGroup();
        itemGroup.patchValue(i);
        this.itemsFormArray.push(itemGroup);
      });
    }

    this.searchForm.patchValue({
      code: item.code,
      version: item.version,
      effectiveDate: item.effectiveDate,
      expiryDate: item.expiryDate,
      inspectionType: item.inspectionType,
      samplingSchemeType: item.samplingSchemeType,
      samplingSchemeConfig: item.samplingSchemeConfig
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    if (this.searchForm.invalid) {
      Object.values(this.searchForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const input: CreateUpdateInspectionStandardDto = this.searchForm.value;

    if (this.isEdit && this.editId) {
      this.inspectionStandardService.update(this.editId, input).subscribe({
        next: () => {
          this.messageService.success('更新成功');
          this.isModalVisible = false;
          this.cdr.markForCheck();
          this.loadData();
        },
        error: () => {
          this.messageService.error('更新失败');
        }
      });
    } else {
      this.inspectionStandardService.create(input).subscribe({
        next: () => {
          this.messageService.success('创建成功');
          this.isModalVisible = false;
          this.cdr.markForCheck();
          this.loadData();
        },
        error: () => {
          this.messageService.error('创建失败');
        }
      });
    }
  }

  showDeleteConfirm(id: string): void {
    this.modalService.confirm({
      nzTitle: '确认删除',
      nzContent: '确定要删除这条记录吗？',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(id),
      nzCancelText: '取消'
    });
  }

  delete(id: string): void {
    this.inspectionStandardService.delete(id).subscribe({
      next: () => {
        this.messageService.success('删除成功');
        this.cdr.markForCheck();
        this.loadData();
      },
      error: () => {
        this.messageService.error('删除失败');
        this.cdr.markForCheck();
      }
    });
  }

  publish(id: string): void {
    this.inspectionStandardService.publish(id).subscribe({
      next: () => {
        this.messageService.success('发布成功');
        this.cdr.markForCheck();
        this.loadData();
      },
      error: () => {
        this.messageService.error('发布失败');
        this.cdr.markForCheck();
      }
    });
  }

  getInspectionTypeText(type: number): string {
    const option = this.inspectionTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }

  getStatusText(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : '';
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'orange';
      case 2:
        return 'green';
      case 3:
        return 'red';
      default:
        return 'default';
    }
  }
}
