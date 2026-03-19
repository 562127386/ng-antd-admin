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

import { MaterialDto, CreateUpdateMaterialDto, GetMaterialListDto } from '../models/material.model';
import { MaterialService } from '../services/material.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
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
    NzModalModule,
    NzPopconfirmModule,
    NzSpaceModule
  ]
})
export class MaterialsComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  readonly materialTypeTpl = viewChild.required<TemplateRef<NzSafeAny>>('materialTypeTpl');
  
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '物料管理',
    breadcrumb: ['首页', '基础数据', '物料管理'],
    desc: ''
  };
  dataList: MaterialDto[] = [];
  checkedCashArray: MaterialDto[] = [];
  isCollapse = true;
  filterForm!: { filter: string; isEnabled: boolean | null };
  isModalVisible = false;
  isEdit = false;
  editId?: string;
  searchFormData: CreateUpdateMaterialDto = {} as CreateUpdateMaterialDto;
  destroyRef = inject(DestroyRef);

  materialTypeOptions = [
    { label: '原材料', value: 1 },
    { label: '半成品', value: 2 },
    { label: '成品', value: 3 }
  ];

  private materialService = inject(MaterialService);
  private modalSrv = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);

  selectedChecked(e: MaterialDto[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.filterForm = { filter: '', isEnabled: null };
    this.getDataList({ pageIndex: 1 });
  }

  getDataList(e?: { pageIndex: number }): void {
    this.tableConfig.loading = true;
    const input: GetMaterialListDto = {
      filter: this.filterForm.filter,
      isEnabled: this.filterForm.isEnabled ?? undefined,
      skipCount: ((e?.pageIndex || this.tableConfig.pageIndex) - 1) * this.tableConfig.pageSize!,
      maxResultCount: this.tableConfig.pageSize!
    };

    this.materialService.getList(input).pipe(
      finalize(() => this.tableLoading(false)),
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
    this.searchFormData = { code: '', name: '', specification: '', drawingNo: '', materialType: 1, batchManagement: false, expiryManagement: false, supplier: '', isEnabled: true };
    this.isModalVisible = true;
  }

  reloadTable(): void {
    this.message.info('刷新成功');
    this.getDataList();
  }

  edit(id: string, dataItem: MaterialDto): void {
    this.isEdit = true;
    this.editId = id;
    this.searchFormData = {
      code: dataItem.code,
      name: dataItem.name,
      specification: dataItem.specification || '',
      drawingNo: dataItem.drawingNo || '',
      materialType: dataItem.materialType,
      batchManagement: dataItem.batchManagement,
      expiryManagement: dataItem.expiryManagement,
      supplier: dataItem.supplier || '',
      defaultStandardId: dataItem.defaultStandardId || '',
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
      this.materialService.update(this.editId, this.searchFormData).pipe(
        finalize(() => this.tableLoading(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.message.success('更新成功');
        this.isModalVisible = false;
        this.getDataList();
      });
    } else {
      this.tableLoading(true);
      this.materialService.create(this.searchFormData).pipe(
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
        this.materialService.delete(id).pipe(
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

  getMaterialTypeText(type: number): string {
    const option = this.materialTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }

  ngOnInit(): void {
    this.filterForm = { filter: '', isEnabled: null };
    this.initTable();
    this.getDataList();
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        { title: '物料编码', field: 'code', width: 120 },
        { title: '物料名称', field: 'name', width: 150 },
        { title: '规格', field: 'specification', width: 120 },
        { title: '图号', field: 'drawingNo', width: 120 },
        { title: '物料类型', field: 'materialType', width: 100, fieldType: 'enum', enumParams: [
          { label: '原材料', value: 1 },
          { label: '半成品', value: 2 },
          { label: '成品', value: 3 }
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
