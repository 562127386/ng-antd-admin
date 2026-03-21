import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef, inject, DestroyRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SamplingSchemeService } from '../services/sampling-scheme.service';
import { SamplingSchemeDto } from '../models/sampling-scheme.model';

@Component({
  selector: 'app-aql-configs',
  templateUrl: './aql-configs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
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
  readonly inspectionLevelTpl = viewChild.required<TemplateRef<NzSafeAny>>('inspectionLevelTpl');
  
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'AQL配置管理',
    breadcrumb: ['首页', '基础数据', 'AQL配置管理'],
    desc: ''
  };
  dataList: AqlConfigDto[] = [];
  checkedCashArray: AqlConfigDto[] = [];
  isCollapse = true;
  filterForm!: { filter: string; isEnabled: boolean | null; aqlValue: number | null; samplingSchemeId: string | null; minSampleSize: number | null; maxSampleSize: number | null; lotSize: number | null; inspectionLevel: number | null };
  isModalVisible = false;
  isEdit = false;
  editId?: string;
  searchFormData: CreateUpdateAqlConfigDto = {} as CreateUpdateAqlConfigDto;
  samplingSchemes: SamplingSchemeDto[] = [];
  inspectionLevelOptions = [
    { label: 'S-1', value: 1 },
    { label: 'S-2', value: 2 },
    { label: 'S-3', value: 3 },
    { label: 'S-4', value: 4 },
    { label: 'I', value: 5 },
    { label: 'II', value: 6 },
    { label: 'III', value: 7 }
  ];

  destroyRef = inject(DestroyRef);

  private aqlConfigService = inject(AqlConfigService);
  private samplingSchemeService = inject(SamplingSchemeService);
  private modalSrv = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);

  selectedChecked(e: AqlConfigDto[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.filterForm = { filter: '', isEnabled: null, aqlValue: null, samplingSchemeId: null, minSampleSize: null, maxSampleSize: null, lotSize: null, inspectionLevel: null };
    this.getDataList({ pageIndex: 1 });
  }

  getDataList(e?: { pageIndex: number }): void {
    this.tableConfig.loading = true;
    const input: GetAqlConfigListDto = {
      filter: this.filterForm.filter,
      isEnabled: this.filterForm.isEnabled ?? undefined,
      aqlValue: this.filterForm.aqlValue ?? undefined,
      samplingSchemeId: this.filterForm.samplingSchemeId ?? undefined,
      minSampleSize: this.filterForm.minSampleSize ?? undefined,
      maxSampleSize: this.filterForm.maxSampleSize ?? undefined,
      lotSize: this.filterForm.lotSize ?? undefined,
      inspectionLevel: this.filterForm.inspectionLevel ?? undefined,
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
    this.filterForm = { filter: '', isEnabled: null, aqlValue: null, samplingSchemeId: null, minSampleSize: null, maxSampleSize: null, lotSize: null, inspectionLevel: null };
    this.initTable();
    this.getDataList();
    this.loadSamplingSchemes();
  }

  loadSamplingSchemes(): void {
    this.samplingSchemeService.getList({ maxResultCount: 1000 }).subscribe({
      next: (result) => {
        this.samplingSchemes = result.items;
        this.cdr.markForCheck();
      }
    });
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        { title: 'AQL编码', field: 'code', width: 100 },
        { title: 'AQL值', field: 'aqlValue', width: 80 },
        { title: '检验水平', field: 'inspectionLevel', width: 100, tdTemplate: this.inspectionLevelTpl() },
        { title: '最小批量', field: 'minLotSize', width: 100 },
         { title: '最大批量', field: 'maxLotSize', width: 100 },
        { title: '样本量字码', field: 'sampleSizeCode', width: 100 },
        { title: '样本量', field: 'sampleSize', width: 80 },
        { title: 'Ac', field: 'acceptanceNumber', width: 50 },
        { title: 'Re', field: 'rejectionNumber', width: 50 },
        { title: '状态', field: 'isEnabled', width: 50, fieldType: 'switch' },
        { title: '操作', tdTemplate: this.operationTpl(), width: 120, fixed: true }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
  }

  getInspectionLevelName(level?: number): string {
    if (level === undefined || level === null) return '';
    const option = this.inspectionLevelOptions.find(o => o.value === level);
    return option ? option.label : level.toString();
  }
}
