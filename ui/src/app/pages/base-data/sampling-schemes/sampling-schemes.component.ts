import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef, inject, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
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

import { SamplingSchemeDto, CreateUpdateSamplingSchemeDto, GetSamplingSchemeListDto } from '../models/sampling-scheme.model';
import { SamplingSchemeService } from '../services/sampling-scheme.service';
import { AqlConfigDto } from '../models/aql-config.model';
import { AqlConfigService } from '../services/aql-config.service';

@Component({
  selector: 'app-sampling-schemes',
  templateUrl: './sampling-schemes.component.html',
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
    NzSpaceModule,
    NzDividerModule
  ]
})
export class SamplingSchemesComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '抽样方案管理',
    breadcrumb: ['首页', '基础数据', '抽样方案管理'],
    desc: ''
  };
  dataList: SamplingSchemeDto[] = [];
  checkedCashArray: SamplingSchemeDto[] = [];
  isCollapse = true;
  filterForm!: { filter: string; isEnabled: boolean | null; schemeType: number | null };
  isModalVisible = false;
  isEdit = false;
  editId?: string;
  modalForm!: FormGroup;
  destroyRef = inject(DestroyRef);
  aqlConfigOptions: AqlConfigDto[] = [];

  schemeTypeOptions = [
    { label: 'AQL抽样', value: 1 },
    { label: 'C=0抽样', value: 2 },
    { label: '计量抽样', value: 3 },
    { label: '连续抽样', value: 4 },
    { label: '跳批抽样', value: 5 }
  ];

  inspectionLevelOptions = [
    { label: 'S-1', value: 1 },
    { label: 'S-2', value: 2 },
    { label: 'S-3', value: 3 },
    { label: 'S-4', value: 4 },
    { label: 'I', value: 5 },
    { label: 'II', value: 6 },
    { label: 'III', value: 7 }
  ];

  private samplingSchemeService = inject(SamplingSchemeService);
  private aqlConfigService = inject(AqlConfigService);
  private modalSrv = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);
  private fb = inject(FormBuilder);

  selectedChecked(e: SamplingSchemeDto[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.filterForm = { filter: '', isEnabled: null, schemeType: null };
    this.getDataList({ pageIndex: 1 });
  }

  getDataList(e?: { pageIndex: number }): void {
    this.tableConfig.loading = true;
    const input: GetSamplingSchemeListDto = {
      filter: this.filterForm.filter,
      isEnabled: this.filterForm.isEnabled ?? undefined,
      schemeType: this.filterForm.schemeType ?? undefined,
      skipCount: ((e?.pageIndex || this.tableConfig.pageIndex) - 1) * this.tableConfig.pageSize!,
      maxResultCount: this.tableConfig.pageSize!
    };

    this.samplingSchemeService.getList(input).pipe(
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
    this.initModalForm();
    this.isModalVisible = true;
  }

  reloadTable(): void {
    this.message.info('刷新成功');
    this.getDataList();
  }

  edit(id: string, dataItem: SamplingSchemeDto): void {
    this.isEdit = true;
    this.editId = id;
    this.initModalForm(dataItem);
    this.isModalVisible = true;
  }

  get currentSchemeType(): number {
    return this.modalForm?.get('schemeType')?.value || 1;
  }

  get showAqlConfig(): boolean {
    return this.currentSchemeType === 1;
  }

  get showCZeroConfig(): boolean {
    return this.currentSchemeType === 2;
  }

  get showVariableConfig(): boolean {
    return this.currentSchemeType === 3;
  }

  get showContinuousConfig(): boolean {
    return this.currentSchemeType === 4;
  }

  get showSkipLotConfig(): boolean {
    return this.currentSchemeType === 5;
  }

  get getCodeErrorTip(): string {
    const control = this.modalForm?.get('code');
    if (control?.hasError('required')) return '请输入方案编码';
    return '';
  }

  get getNameErrorTip(): string {
    const control = this.modalForm?.get('name');
    if (control?.hasError('required')) return '请输入方案名称';
    return '';
  }

  getC0ValidationMessage(field: string): string {
    if (field === 'acceptanceNumber') {
      const control = this.modalForm?.get('acceptanceNumber');
      if (control?.hasError('c0Zero')) return 'C=0抽样时，接收数必须为0';
    }
    if (field === 'rejectionNumber') {
      const control = this.modalForm?.get('rejectionNumber');
      if (control?.hasError('c0One')) return 'C=0抽样时，拒收数必须为1';
    }
    return '';
  }

  initModalForm(dataItem?: SamplingSchemeDto): void {
    this.modalForm = this.fb.group({
      code: [dataItem?.code || '', [Validators.required]],
      name: [dataItem?.name || '', [Validators.required]],
      schemeType: [dataItem?.schemeType || 1, [Validators.required]],
      description: [dataItem?.description || ''],
      sortOrder: [dataItem?.sortOrder || 0],
      isEnabled: [dataItem?.isEnabled ?? true],
      aqlConfigId: [dataItem?.aqlConfigId || null],
      fixedSampleSize: [dataItem?.fixedSampleSize || null],
      samplePercentage: [dataItem?.samplePercentage || null],
      acceptanceNumber: [dataItem?.acceptanceNumber ?? 0, [Validators.required]],
      rejectionNumber: [dataItem?.rejectionNumber ?? 1, [Validators.required]]
    });

    this.modalForm.get('acceptanceNumber')?.setValidators([
      Validators.required,
      (control) => {
        if (this.currentSchemeType === 2 && control.value !== 0) {
          return { c0Zero: true };
        }
        return null;
      }
    ]);
    this.modalForm.get('rejectionNumber')?.setValidators([
      Validators.required,
      (control) => {
        if (this.currentSchemeType === 2 && control.value !== 1) {
          return { c0One: true };
        }
        return null;
      }
    ]);
    
    this.cdr.markForCheck();
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    if (!this.modalForm.valid) {
      Object.values(this.modalForm.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(c => {
            if (c.invalid) {
              c.markAsDirty();
              c.updateValueAndValidity();
            }
          });
        } else {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity();
          }
        }
      });
      this.message.error('请填写必填项');
      return;
    }

    const formValue = this.modalForm.value;
    let formData: CreateUpdateSamplingSchemeDto;

    switch (formValue.schemeType) {
      case 1:
        formData = {
          code: formValue.code,
          name: formValue.name,
          schemeType: formValue.schemeType,
          description: formValue.description,
          sortOrder: formValue.sortOrder,
          isEnabled: formValue.isEnabled,
          aqlConfigId: formValue.aqlConfigId,
          fixedSampleSize: formValue.fixedSampleSize,
          samplePercentage: formValue.samplePercentage,
          acceptanceNumber: formValue.acceptanceNumber,
          rejectionNumber: formValue.rejectionNumber
        } as CreateUpdateSamplingSchemeDto;
        break;
      case 2:
        formData = {
          code: formValue.code,
          name: formValue.name,
          schemeType: formValue.schemeType,
          description: formValue.description,
          sortOrder: formValue.sortOrder,
          isEnabled: formValue.isEnabled,
          fixedSampleSize: formValue.fixedSampleSize,
          acceptanceNumber: formValue.acceptanceNumber,
          rejectionNumber: formValue.rejectionNumber
        } as CreateUpdateSamplingSchemeDto;
        break;
      case 3:
        formData = {
          code: formValue.code,
          name: formValue.name,
          schemeType: formValue.schemeType,
          description: formValue.description,
          sortOrder: formValue.sortOrder,
          isEnabled: formValue.isEnabled,
          fixedSampleSize: formValue.fixedSampleSize
        } as CreateUpdateSamplingSchemeDto;
        break;
      case 4:
        formData = {
          code: formValue.code,
          name: formValue.name,
          schemeType: formValue.schemeType,
          description: formValue.description,
          sortOrder: formValue.sortOrder,
          isEnabled: formValue.isEnabled,
          samplePercentage: formValue.samplePercentage
        } as CreateUpdateSamplingSchemeDto;
        break;
      case 5:
        formData = {
          code: formValue.code,
          name: formValue.name,
          schemeType: formValue.schemeType,
          description: formValue.description,
          sortOrder: formValue.sortOrder,
          isEnabled: formValue.isEnabled
        } as CreateUpdateSamplingSchemeDto;
        break;
      default:
        formData = formValue;
    }

    if (this.isEdit && this.editId) {
      this.tableLoading(true);
      this.samplingSchemeService.update(this.editId, formData).pipe(
        finalize(() => this.tableLoading(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.message.success('更新成功');
        this.isModalVisible = false;
        this.getDataList();
      });
    } else {
      this.tableLoading(true);
      this.samplingSchemeService.create(formData).pipe(
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
        this.samplingSchemeService.delete(id).pipe(
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

  getSchemeTypeText(type: number): string {
    const option = this.schemeTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }

  getInspectionLevelText(level: number): string {
    const option = this.inspectionLevelOptions.find(o => o.value === level);
    return option ? option.label : '';
  }

  loadAqlConfigs(): void {
    this.aqlConfigService.getList({ isEnabled: true, maxResultCount: 1000 }).subscribe({
      next: (result) => {
        this.aqlConfigOptions = result.items;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    this.filterForm = { filter: '', isEnabled: null, schemeType: null };
    this.initTable();
    this.getDataList();
    this.loadAqlConfigs();
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        { title: '方案编码', field: 'code', width: 120 },
        { title: '方案名称', field: 'name', width: 150 },
        { title: '方案类型', field: 'schemeType', width: 100, fieldType: 'enum', enumParams: [
          { label: 'AQL抽样', value: 1 },
          { label: 'C=0抽样', value: 2 },
          { label: '计量抽样', value: 3 },
          { label: '连续抽样', value: 4 },
          { label: '跳批抽样', value: 5 }
        ]},
        { title: '排序', field: 'sortOrder', width: 80 },
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
