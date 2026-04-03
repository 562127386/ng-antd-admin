import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerOptions } from 'ng-zorro-antd/drawer';
import {
  QualityInspectionPlanDto, 
  GetQualityInspectionPlanListDto
} from '../models/quality-inspection-plan.model';
import { QualityInspectionPlanService } from '../services/quality-inspection-plan.service';
import { DrawerWrapService } from '@app/drawer/base-drawer';
import { QualityInspectionPlanDrawerComponent } from '@app/drawer/biz-drawer/quality-inspection-plan-drawer/quality-inspection-plan-drawer.component';
import { ModalBtnStatus } from '@widget/base-modal';

@Component({
  selector: 'app-quality-inspection-plans',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzTagModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule
  ],
  templateUrl: './quality-inspection-plans.component.html',
  styleUrls: ['./quality-inspection-plans.component.less']
})
export class QualityInspectionPlansComponent implements OnInit {
  private qualityInspectionPlanService = inject(QualityInspectionPlanService);
  private fb = inject(FormBuilder);
  private modalService = inject(NzModalService);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private drawerWrapService = inject(DrawerWrapService);

  loading = false;
  data: QualityInspectionPlanDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;

  inspectionTypeOptions = [
    { label: 'IQC', value: 1 },
    { label: 'IPQC', value: 2 },
    { label: 'FQC', value: 3 },
    { label: 'OQC', value: 4 }
  ];

  statusOptions = [
    { label: '草稿', value: 1 },
    { label: '生效中', value: 2 },
    { label: '已失效', value: 3 }
  ];

  inspectionLevelOptions = [
    { label: '一般I', value: 0 },
    { label: '一般II', value: 1 },
    { label: '一般III', value: 2 },
    { label: '特殊S-1', value: 3 },
    { label: '特殊S-2', value: 4 },
    { label: '特殊S-3', value: 5 },
    { label: '特殊S-4', value: 6 }
  ];

  samplingSchemeTypeOptions = [
    { label: 'AQL', value: 1 },
    { label: 'C=0', value: 2 },
    { label: '计量型', value: 3 },
    { label: '连续生产', value: 4 },
    { label: '跳批', value: 5 }
  ];

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      status: [null]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetQualityInspectionPlanListDto = {
      filter: this.filterForm.value.filter,
      status: this.filterForm.value.status,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.qualityInspectionPlanService.getList(input).subscribe({
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
    const defaultOptions: NzDrawerOptions = {
      nzWidth: '90%',
      nzTitle: '新增质检方案'
    };
    this.drawerWrapService
      .show(QualityInspectionPlanDrawerComponent, defaultOptions, { mode: 'create' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        this.loadData();
      });
  }

  showEditModal(item: QualityInspectionPlanDto): void {
    const defaultOptions: NzDrawerOptions = {
      nzWidth: '90%',
      nzTitle: '编辑质检方案'
    };
    this.drawerWrapService
      .show(QualityInspectionPlanDrawerComponent, defaultOptions, { mode: 'edit', id: item.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        this.loadData();
      });
  }

  showViewModal(item: QualityInspectionPlanDto): void {
    const defaultOptions: NzDrawerOptions = {
      nzWidth: '90%',
      nzTitle: '查看质检方案'
    };
    this.drawerWrapService
      .show(QualityInspectionPlanDrawerComponent, defaultOptions, { mode: 'view', id: item.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
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
    this.qualityInspectionPlanService.delete(id).subscribe({
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
    this.qualityInspectionPlanService.publish(id).subscribe({
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

  getInspectionLevelText(level: number | undefined): string {
    if (level === undefined) {
      return '';
    }
    const option = this.inspectionLevelOptions.find(o => o.value === level);
    return option ? option.label : '';
  }

  getSamplingSchemeTypeText(type: number | undefined): string {
    if (type === undefined) {
      return '';
    }
    const option = this.samplingSchemeTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }
}
