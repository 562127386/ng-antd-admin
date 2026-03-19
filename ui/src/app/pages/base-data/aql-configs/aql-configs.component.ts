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
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { AqlConfigDto, CreateUpdateAqlConfigDto, GetAqlConfigListDto } from '../models/aql-config.model';
import { AqlConfigService } from '../services/aql-config.service';

@Component({
  selector: 'app-aql-configs',
  templateUrl: './aql-configs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzGridModule,
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
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
export class AqlConfigsComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'AQL配置管理',
    breadcrumb: ['首页', '基础数据', 'AQL配置管理'],
    desc: ''
  };
  dataList: AqlConfigDto[] = [];
  checkedCashArray: AqlConfigDto[] = [];
  isCollapse = true;
  filterForm!: { filter: string; isEnabled: boolean | null };
  isModalVisible = false;
  isEdit = false;
  editId?: string;
  searchFormData: CreateUpdateAqlConfigDto = {} as CreateUpdateAqlConfigDto;
  destroyRef = inject(DestroyRef);

  private aqlConfigService = inject(AqlConfigService);
  private modalSrv = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);

  selectedChecked(e: AqlConfigDto[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.filterForm = { filter: '', isEnabled: null };
    this.getDataList({ pageIndex: 1 });
  }

  getDataList(e?: { pageIndex: number }): void {
    this.tableConfig.loading = true;
    const input: GetAqlConfigListDto = {
      filter: this.filterForm.filter,
      isEnabled: this.filterForm.isEnabled ?? undefined,
      skipCount: ((e?.pageIndex || this.tableConfig.pageIndex) - 1) * this.tableConfig.pageSize!,
      maxResultCount: this.tableConfig.pageSize!
    };

    this.aqlConfigService.getList(input).pipe(
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
    this.searchFormData = { code: '', aqlValue: 0, inspectionLevel: 1, minLotSize: 0, maxLotSize: 0, sampleSizeCode: '', sampleSize: 0, acceptanceNumber: 0, rejectionNumber: 0, remark: '', isEnabled: true };
    this.isModalVisible = true;
  }

  reloadTable(): void {
    this.message.info('刷新成功');
    this.getDataList();
  }

  edit(id: string, dataItem: AqlConfigDto): void {
    this.isEdit = true;
    this.editId = id;
    this.searchFormData = {
      code: dataItem.code,
      aqlValue: dataItem.aqlValue,
      inspectionLevel: dataItem.inspectionLevel,
      minLotSize: dataItem.minLotSize,
      maxLotSize: dataItem.maxLotSize,
      sampleSizeCode: dataItem.sampleSizeCode,
      sampleSize: dataItem.sampleSize,
      acceptanceNumber: dataItem.acceptanceNumber,
      rejectionNumber: dataItem.rejectionNumber,
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
    if (!this.searchFormData.code) {
      this.message.error('请填写必填项');
      return;
    }

    if (this.isEdit && this.editId) {
      this.tableLoading(true);
      this.aqlConfigService.update(this.editId, this.searchFormData).pipe(
        finalize(() => this.tableLoading(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.message.success('更新成功');
        this.isModalVisible = false;
        this.getDataList();
      });
    } else {
      this.tableLoading(true);
      this.aqlConfigService.create(this.searchFormData).pipe(
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
        this.aqlConfigService.delete(id).pipe(
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

  ngOnInit(): void {
    this.filterForm = { filter: '', isEnabled: null };
    this.initTable();
    this.getDataList();
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        { title: 'AQL编码', field: 'code', width: 100 },
        { title: 'AQL值', field: 'aqlValue', width: 80 },
        { title: '检验水平', field: 'inspectionLevel', width: 100 },
        { title: '批量范围', field: 'minLotSize', width: 150 },
        { title: '样本量字码', field: 'sampleSizeCode', width: 100 },
        { title: '样本量', field: 'sampleSize', width: 80 },
        { title: 'Ac', field: 'acceptanceNumber', width: 60 },
        { title: 'Re', field: 'rejectionNumber', width: 60 },
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
