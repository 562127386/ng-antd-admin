import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef, inject, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { DefectDto, CreateUpdateDefectDto, GetDefectListDto } from '../models/defect.model';
import { DefectService } from '../services/defect.service';

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzGridModule,
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    AntTableComponent,
    NzSwitchModule,
    NzTagModule,
    NzModalModule,
    NzPopconfirmModule,
    NzSpaceModule
  ]
})
export class DefectsComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  readonly enabledFlag = viewChild.required<TemplateRef<NzSafeAny>>('enabledFlag');
  readonly categoryTpl = viewChild.required<TemplateRef<NzSafeAny>>('categoryTpl');
  readonly severityTpl = viewChild.required<TemplateRef<NzSafeAny>>('severityTpl');
  readonly moduleTpl = viewChild.required<TemplateRef<NzSafeAny>>('moduleTpl');
  
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '缺陷管理',
    breadcrumb: ['首页', '基础数据', '缺陷管理'],
    desc: ''
  };
  dataList: DefectDto[] = [];
  checkedCashArray: DefectDto[] = [];
  isCollapse = true;
  filterForm!: { filter: string; category: number | null; severity: number | null; module: number | null; isEnabled: boolean | null };
  isModalVisible = false;
  isEdit = false;
  editId?: string;
  searchFormData: CreateUpdateDefectDto = {} as CreateUpdateDefectDto;
  destroyRef = inject(DestroyRef);

  categoryOptions = [
    { label: '外观', value: 1 },
    { label: '尺寸', value: 2 },
    { label: '性能', value: 3 },
    { label: '包装', value: 4 }
  ];

  severityOptions = [
    { label: '轻微', value: 1 },
    { label: '一般', value: 2 },
    { label: '严重', value: 3 },
    { label: '致命', value: 4 }
  ];

  moduleOptions = [
    { label: 'IQC', value: 1 },
    { label: 'IPQC', value: 2 },
    { label: 'FQC', value: 3 },
    { label: 'OQC', value: 4 }
  ];

  private defectService = inject(DefectService);
  private modalSrv = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);

  selectedChecked(e: DefectDto[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.filterForm = { filter: '', category: null, severity: null, module: null, isEnabled: null };
    this.getDataList({ pageIndex: 1 });
  }

  getDataList(e?: { pageIndex: number }): void {
    this.tableConfig.loading = true;
    const input: GetDefectListDto = {
      filter: this.filterForm.filter,
      category: this.filterForm.category ?? undefined,
      severity: this.filterForm.severity ?? undefined,
      module: this.filterForm.module ?? undefined,
      isEnabled: this.filterForm.isEnabled ?? undefined,
      skipCount: ((e?.pageIndex || this.tableConfig.pageIndex) - 1) * this.tableConfig.pageSize!,
      maxResultCount: this.tableConfig.pageSize!
    };

    this.defectService.getList(input).pipe(
      finalize(() => {
        this.tableLoading(false);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.dataList = result.items || [];
      this.tableConfig.total = result.totalCount || 0;
      this.tableConfig.pageIndex = e?.pageIndex || this.tableConfig.pageIndex;
      this.tableLoading(false);
    });
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  add(): void {
    this.isEdit = false;
    this.editId = undefined;
    this.searchFormData = { code: '', name: '', category: 1, severity: 1, module: 1, remark: '', isEnabled: true };
    this.isModalVisible = true;
  }

  reloadTable(): void {
    this.message.info('刷新成功');
    this.getDataList();
  }

  edit(id: string, dataItem: DefectDto): void {
    this.isEdit = true;
    this.editId = id;
    this.searchFormData = {
      code: dataItem.code,
      name: dataItem.name,
      category: dataItem.category,
      severity: dataItem.severity,
      module: dataItem.module,
      remark: dataItem.remark || '',
      isEnabled: dataItem.isEnabled
    };
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    if (!this.searchFormData.code || !this.searchFormData.name) {
      this.message.error('请填写必填项');
      return;
    }

    if (this.isEdit && this.editId) {
      this.tableLoading(true);
      this.defectService.update(this.editId, this.searchFormData).pipe(
        finalize(() => this.tableLoading(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.message.success('更新成功');
        this.isModalVisible = false;
        this.getDataList();
      });
    } else {
      this.tableLoading(true);
      this.defectService.create(this.searchFormData).pipe(
        finalize(() => this.tableLoading(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.message.success('创建成功');
        this.isModalVisible = false;
        this.getDataList();
      });
    }
  }

  del(id: string): void {
    this.modalSrv.confirm({
      nzTitle: '确定要删除吗？',
      nzContent: '删除后不可恢复',
      nzOnOk: () => {
        this.tableLoading(true);
        this.defectService.delete(id).pipe(
          finalize(() => this.tableLoading(false)),
          takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
          if (this.dataList.length === 1 && this.tableConfig.pageIndex !== 1) {
            this.tableConfig.pageIndex--;
          }
          this.getDataList();
        });
      }
    });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  getCategoryText(category: number): string {
    const option = this.categoryOptions.find(o => o.value === category);
    return option ? option.label : '';
  }

  getSeverityText(severity: number): string {
    const option = this.severityOptions.find(o => o.value === severity);
    return option ? option.label : '';
  }

  getSeverityColor(severity: number): string {
    const colors: Record<number, string> = { 1: 'green', 2: 'orange', 3: 'red', 4: 'magenta' };
    return colors[severity] || 'default';
  }

  getModuleText(module: number): string {
    const option = this.moduleOptions.find(o => o.value === module);
    return option ? option.label : '';
  }

  changeEnabled(e: boolean, id: string): void {
    const switchData = e as unknown as { field: string; value: boolean; row: NzSafeAny };
    const rowId = switchData.field ? switchData.row.id : id;
    const newValue = switchData.field ? switchData.value : !e;
    this.tableLoading(true);
    this.defectService.setEnabled(rowId, newValue).pipe(
      finalize(() => this.tableLoading(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.message.success('状态更新成功');
      this.getDataList();
    });
  }

  ngOnInit(): void {
    this.filterForm = { filter: '', category: null, severity: null, module: null, isEnabled: null };
    this.initTable();
    this.getDataList();
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        { title: '缺陷编码', field: 'code', width: 120 },
        { title: '缺陷名称', field: 'name', width: 150 },
        { title: '缺陷分类', field: 'category', width: 100, fieldType: 'enum', enumParams: [
          { label: '外观', value: 1 },
          { label: '尺寸', value: 2 },
          { label: '性能', value: 3 },
          { label: '包装', value: 4 }
        ]},
        { title: '严重等级', field: 'severity', width: 100, fieldType: 'enum', enumParams: [
          { label: '轻微', value: 1, color: 'green' },
          { label: '一般', value: 2, color: 'orange' },
          { label: '严重', value: 3, color: 'red' },
          { label: '致命', value: 4, color: 'magenta' }
        ]},
        { title: '所属模块', field: 'module', width: 100, fieldType: 'enum', enumParams: [
          { label: 'IQC', value: 1 },
          { label: 'IPQC', value: 2 },
          { label: 'FQC', value: 3 },
          { label: 'OQC', value: 4 }
        ]},
        { title: '状态', field: 'isEnabled', width: 80, fieldType: 'switch' },
        { title: '操作', tdTemplate: this.operationTpl(), width: 120, fixed: true }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
