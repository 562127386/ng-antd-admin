import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef, ViewChild, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { IqcInspectionOrderDto, GetIqcInspectionOrderListDto } from '../models/iqc-inspection.model';
import { IqcInspectionService } from '../services/iqc-inspection.service';
import { InspectionStatus, InspectionResult } from '../models/enums';
import { DrawerWrapService } from '@app/drawer/base-drawer';
import { IqcInspectionDrawerComponent } from '@app/drawer/biz-drawer/iqc-inspection-drawer/iqc-inspection-drawer.component';
import { NonConformingService } from '../services/non-conforming.service';
import { ModalBtnStatus, ModalWrapService } from '@widget/base-modal';
import { NzDrawerOptions } from 'ng-zorro-antd/drawer';
import { CompleteInspectionModalComponent } from '../components/complete-inspection-modal/complete-inspection-modal.component';

@Component({
  selector: 'app-iqc-inspections',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzTagModule
  ],
  templateUrl: './iqc-inspections.component.html',
  styleUrls: ['./iqc-inspections.component.less']
})
export class IqcInspectionsComponent implements OnInit {
  private iqcInspectionService = inject(IqcInspectionService);
  private nonConformingService = inject(NonConformingService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private drawerWrapService = inject(DrawerWrapService);
  private modalWrapService = inject(ModalWrapService);

  loading = false;
  data: IqcInspectionOrderDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;

  statusOptions = [
    { label: '草稿', value: InspectionStatus.Draft, color: 'default' },
    { label: '待检验', value: InspectionStatus.Pending, color: 'processing' },
    { label: '检验中', value: InspectionStatus.InProgress, color: 'warning' },
    { label: '已完成', value: InspectionStatus.Completed, color: 'success' },
    { label: '已取消', value: InspectionStatus.Cancelled, color: 'error' }
  ];

  resultOptions = [
   // { label: '待判定', value: 0, color: 'default' },
    { label: '合格', value: InspectionResult.Accepted, color: 'success' },
    { label: '不合格', value: InspectionResult.Rejected, color: 'error' },
    { label: '特采', value: InspectionResult.Concession, color: 'warning' },
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
      result: [null]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetIqcInspectionOrderListDto = {
      filter: this.filterForm.value.filter,
      status: this.filterForm.value.status,
      result: this.filterForm.value.result,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.iqcInspectionService.getList(input).subscribe({
      next: (result) => {
        this.data = result.items;
        this.total = result.totalCount;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.messageService.error('加载数据失败');
        this.cdr.markForCheck();
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
    const defaultOptions: NzDrawerOptions = {
      nzWidth: '80%',
      nzTitle: '新增检验单'
    };
    this.drawerWrapService
      .show(IqcInspectionDrawerComponent, defaultOptions, { mode: 'create' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        this.loadData();
      });
  }

  // 获取页脚模板引用
  @ViewChild('cancelTpl') cancelTpl!: TemplateRef<any>;
   // 页脚-取消按钮回调
  onDrawerCancel(): void {
    console.log('点击了抽屉取消按钮');
    this.drawerWrapService.cancel();
  }

  showViewModal(item: IqcInspectionOrderDto): void {
    const isInProgress = item.status === InspectionStatus.InProgress;
    const defaultOptions: NzDrawerOptions = {
      nzWidth: '100%',
      nzTitle: isInProgress ? '检验执行' : '查看检验单',
      nzFooter: this.cancelTpl
    };
    // if (!isInProgress) {
    //   defaultOptions.nzFooter = this.cancelTpl;
    // }
    this.drawerWrapService
      .show(IqcInspectionDrawerComponent, defaultOptions, { mode: isInProgress ? 'inspect' : 'view', id: item.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (isInProgress) {
          this.loadData();
        }
      });
  }

  showEditModal(item: IqcInspectionOrderDto): void {
    if (item.status !== InspectionStatus.Draft && item.status !== InspectionStatus.Pending) {
      this.messageService.warning('只有草稿或待检验状态的单据可以编辑');
      return;
    }
    const defaultOptions: NzDrawerOptions = {
      nzWidth: '85%',
      nzTitle: '编辑检验单'
    };
    this.drawerWrapService
      .show(IqcInspectionDrawerComponent, defaultOptions, { mode: 'edit', id: item.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        this.loadData();
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

  getResultText(result?: number): string {
    if (result === undefined || result === null) return '';
    const option = this.resultOptions.find(o => o.value === result);
    return option ? option.label : '';
  }

  getResultColor(result?: number): string {
    if (result === undefined || result === null) return 'default';
    const option = this.resultOptions.find(o => o.value === result);
    return option ? option.color : 'default';
  }

  canEdit(status: number): boolean {
    return status === InspectionStatus.Draft || status === InspectionStatus.Pending;
  }

  canDelete(status: number): boolean {
    return status === InspectionStatus.Draft;
  }

  canStartInspection(status: number): boolean {
    return status === InspectionStatus.Pending;
  }

  canCompleteInspection(status: number): boolean {
    return status === InspectionStatus.InProgress;
  }

  canCancel(status: number): boolean {
    return status !== InspectionStatus.Cancelled;
  }

  canExecuteInspection(status: number): boolean {
    return status === InspectionStatus.InProgress;
  }

  canSubmit(status: number): boolean {
    return status === InspectionStatus.Draft;
  }

  submitInspection(id: string): void {
    this.iqcInspectionService.submit(id).subscribe({
      next: () => {
        this.messageService.success('提交成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('提交失败');
      }
    });
  }

  startInspection(id: string): void {
    this.iqcInspectionService.startInspection(id).subscribe({
      next: () => {
        const defaultOptions: NzDrawerOptions = {
          nzWidth: '100%',
          nzTitle: '检验执行',
          nzFooter: this.cancelTpl
        };
        this.drawerWrapService
          .show(IqcInspectionDrawerComponent, defaultOptions, { mode: 'inspect', id: id })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.loadData();
          });
      },
      error: () => {
        this.messageService.error('开始检验失败');
      }
    });
  }

  completeInspection(item: IqcInspectionOrderDto): void {
    this.iqcInspectionService.get(item.id).subscribe({
      next: (order) => {
        this.modalWrapService
          .show(CompleteInspectionModalComponent, { 
            nzTitle: '完成检验',
            nzWidth: 800
          }, { inspectionOrder: order })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((result: any) => {
            if (!result || result.status === ModalBtnStatus.Cancel || !result.modalValue) {
              return;
            }

            const modalValue = result.modalValue;
            const input = {
              result: modalValue.result || modalValue,
              remark: modalValue.remark || '',
              qualifiedSampleCount: modalValue.qualifiedSampleCount,
              unqualifiedSampleCount: modalValue.unqualifiedSampleCount,
              incompleteSampleCount: modalValue.incompleteSampleCount,
              unqualifiedItemCount: modalValue.unqualifiedItemCount,
              qualifiedItemCount: modalValue.qualifiedItemCount,
              pendingItemCount: modalValue.pendingItemCount
            };
            this.iqcInspectionService.completeInspection(item.id, input).subscribe({
              next: () => {
                this.messageService.success('完成检验成功');
                this.loadData();
              },
              error: () => {
                this.messageService.error('完成检验失败');
              }
            });
          });
      },
      error: () => {
        this.messageService.error('加载检验单失败');
      }
    });
  }

  cancelInspection(id: string): void {
    this.iqcInspectionService.cancel(id).subscribe({
      next: () => {
        this.messageService.success('取消成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('取消失败');
      }
    });
  }

  showDeleteConfirm(id: string): void {
    this.iqcInspectionService.delete(id).subscribe({
      next: () => {
        this.messageService.success('删除成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('删除失败');
      }
    });
  }

  createNonConforming(item: IqcInspectionOrderDto): void {
    this.nonConformingService.createFromIqcInspection(item.id).subscribe({
      next: (result) => {
        this.messageService.success('创建不合格品处理单成功，单号：' + result.orderNo);
      },
      error: () => {
        this.messageService.error('创建不合格品处理单失败');
      }
    });
  }

  canCreateNonConforming(status: number, result?: number): boolean {
    return status === InspectionStatus.Completed && result === InspectionResult.Rejected;
  }
}
