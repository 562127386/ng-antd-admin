import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef, inject, DestroyRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { SearchCommonVO } from '@core/services/types';
import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ModalBtnStatus } from '@widget/base-modal';

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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';

import { QualityIndicatorDto, CreateUpdateQualityIndicatorDto, InspectionRuleDto, CreateUpdateInspectionRuleDto } from '../models/quality-indicator.model';
import { QualityIndicatorService } from '../services/quality-indicator.service';
import { InspectionRuleComponent } from '../components/inspection-rule.component';

interface SearchParam {
  code: string;
  name: string;
  indicatorCategory: string;
}

@Component({
  selector: 'app-quality-indicators',
  templateUrl: './quality-indicators.component.html',
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
    NzSelectModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    NzSwitchModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzSpaceModule,
    NzTableModule,
    CardTableWrapComponent,
    AntTableComponent,
    InspectionRuleComponent
  ],
  styleUrls: ['./quality-indicators.component.less']
})
export class QualityIndicatorsComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  readonly enabledFlag = viewChild.required<TemplateRef<NzSafeAny>>('enabledFlag');
  readonly judgmentTagsTpl = viewChild.required<TemplateRef<NzSafeAny>>('judgmentTagsTpl');
  
  searchParam: Partial<SearchParam> = {};
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '质检指标管理',
    breadcrumb: ['首页', '基础数据', '质检指标'],
    desc: '质检指标管理，包含指标的基本信息和判定规则配置'
  };
  dataList: QualityIndicatorDto[] = [];
  checkedCashArray: QualityIndicatorDto[] = [];
  isCollapse = true;
  currentItemId: string | null = null;
  isModalVisible = false;
  currentItem: QualityIndicatorDto | null = null;
  modalForm!: FormGroup;
  
  // 判定规则相关属性
  isInspectionRulesVisible = false;
  currentInspectionItem: QualityIndicatorDto | null = null;
  inspectionRules: InspectionRuleDto[] = [];
  inspectionRulesLoading = false;
  isInspectionRuleModalVisible = false;
  currentInspectionRule: InspectionRuleDto | null = null;
  inspectionRuleForm!: FormGroup;
  
  destroyRef = inject(DestroyRef);
  private qualityIndicatorService = inject(QualityIndicatorService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(NzModalService);

  indicatorCategories = [
    { label: '包装', value: '包装' },
    { label: '标示', value: '标示' },
    { label: '外观', value: '外观' },
    { label: '数量', value: '数量' },
    { label: '丝印', value: '丝印' },
    { label: '尺寸', value: '尺寸' },
    { label: '部品', value: '部品' }
  ];

  inspectionTypes = [
     { label: '计数', value: '计数' },
     { label: '计量', value: '计量' }
  ];

  dataTypes = [
    { label: '文本', value: '文本' },
    { label: '数值', value: '数值' },
    { label: '日期', value: '日期' },
    { label: '选择', value: '选择' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.initTable();
    this.getDataList();
  }

  initForm(): void {
    this.modalForm = this.fb.group({
      code: ['', Validators.required],
      indicatorCategory: ['', Validators.required],
      name: ['', Validators.required],
      inspectionType: ['', Validators.required],
      defaultValue: [''],
      dataType: ['数值'],
      unit: [''],
      decimalPlaces: [0],
      isCritical: [false],
      isEnabled: [true],
      remark: [''],
      sortOrder: [0]
    });
    
    this.initInspectionRuleForm();
  }

  initInspectionRuleForm(): void {
    this.inspectionRuleForm = this.fb.group({
      name: ['', Validators.required],
      severityLevel: ['', Validators.required],
      priority: [0],
      conditionExpression: [''],
      judgmentResult: ['', Validators.required],
      description: [''],
      executeAction: [''],
      remark: ['']
    });
  }

  selectedChecked(e: QualityIndicatorDto[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.searchParam = {};
    this.getDataList({ pageIndex: 1 });
  }

  getDataList(e?: { pageIndex: number }): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<NzSafeAny> = {
      MaxResultCount: this.tableConfig.pageSize!,
      pageIndex: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.qualityIndicatorService
      .getList({
        skipCount: ((params.pageIndex || 1) - 1) * (params.MaxResultCount || 10),
        maxResultCount: params.MaxResultCount || 10,
        sorting: 'sortOrder asc',
        ...params.filters
      })
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: { items: QualityIndicatorDto[]; totalCount: number }) => {
        const { items, totalCount } = data;
        const list = items || [];
        const total = totalCount || 0;
        // 转换字段名，将大写开头的字段名转换为小写开头的字段名
        this.dataList = list.map((item: any) => ({
          id: item.id || item.Id,
          code: item.code || item.Code,
          indicatorCategory: item.indicatorCategory || item.IndicatorCategory,
          name: item.name || item.Name,
          inspectionType: item.inspectionType || item.InspectionType,
          defaultValue: item.defaultValue || item.DefaultValue,
          dataType: item.dataType || item.DataType,
          unit: item.unit || item.Unit,
          decimalPlaces: item.decimalPlaces || item.DecimalPlaces,
          isCritical: item.isCritical || item.IsCritical,
          isEnabled: item.isEnabled || item.IsEnabled,
          remark: item.remark || item.Remark,
          sortOrder: item.sortOrder || item.SortOrder,
          creationTime: item.creationTime || item.CreationTime,
          creatorId: item.creatorId || item.CreatorId,
          lastModificationTime: item.lastModificationTime || item.LastModificationTime,
          lastModifierId: item.lastModifierId || item.LastModifierId
        }));
        this.tableConfig.total = total!;
        this.tableLoading(false);
        this.checkedCashArray = [...this.checkedCashArray];
      });
  }

  // 触发表格变更检测
  tableChangeDectction(): void {
    // 改变引用触发变更检测。
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  // 修改一页几条
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  /*展开*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        {
          title: '编码',
          field: 'code',
          width: 100
        },
        {
          title: '指标类别',
          field: 'indicatorCategory',
          width: 100
        },
        {
          title: '名称',
          field: 'name',
          width: 100
        },
        {
          title: '检验类型',
          field: 'inspectionType',
          width: 100
        },
        {
          title: '默认值',
          field: 'defaultValue',
          width: 100
        },
        {
          title: '数据类型',
          field: 'dataType',
          width: 100
        },
        {
          title: '单位',
          field: 'unit',
          width: 80
        },
        {
          title: '小数位数',
          field: 'decimalPlaces',
          width: 80
        },
        // {
        //   title: '不良状态',
        //   field: 'defectStatus',
        //   width: 100
        // },
        // {
        //   title: '不良判定',
        //   width: 120,
        //   tdTemplate: this.judgmentTagsTpl()
        // },
        {
          title: '是否启用',
          width: 100,
          field: 'isEnabled',
          tdTemplate: this.enabledFlag()
        },
        {
          title: '排序',
          field: 'sortOrder',
          width: 80
        },
        {
          title: '操作',
          tdTemplate: this.operationTpl(),
          width: 150,
          fixed: true
        }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
  }

  add(): void {
    this.currentItem = null;
    this.currentItemId = null;
    this.modalForm.reset({
      code: '',
      indicatorCategory: '',
      name: '',
      inspectionType: '',
      defaultValue: '',
      dataType: '数值',
      unit: '',
      decimalPlaces: 0,
      isCritical: false,
      isEnabled: true,
      remark: '',
      sortOrder: 0
    });
    this.isModalVisible = true;
  }

  reloadTable(): void {
    this.messageService.info('刷新成功');
    this.getDataList();
  }

  edit(id: string, dataItem: QualityIndicatorDto): void {
    this.currentItem = dataItem;
    this.currentItemId = dataItem.id;
    this.modalForm.patchValue({
      code: dataItem.code,
      indicatorCategory: dataItem.indicatorCategory,
      name: dataItem.name,
      inspectionType: dataItem.inspectionType,
      defaultValue: dataItem.defaultValue,
      dataType: dataItem.dataType,
      unit: dataItem.unit,
      decimalPlaces: dataItem.decimalPlaces,
      isCritical: dataItem.isCritical,
      isEnabled: dataItem.isEnabled,
      remark: dataItem.remark,
      sortOrder: dataItem.sortOrder
    });
    this.isModalVisible = true;
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  addEditData(param: CreateUpdateQualityIndicatorDto, methodName: 'create' | 'update'): void {
    this.tableLoading(true);
    if (methodName === 'update' && this.currentItem) {
      this.qualityIndicatorService.update(this.currentItem.id, param)
        .pipe(
          finalize(() => {
            this.tableLoading(false);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: () => {
            this.getDataList();
            this.isModalVisible = false;
            this.messageService.success('更新成功');
          },
          error: (err) => {
            // 错误已在全局拦截器中处理，这里不需要额外处理
          }
        });
    } else {
      this.qualityIndicatorService.create(param)
        .pipe(
          finalize(() => {
            this.tableLoading(false);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: () => {
            this.getDataList();
            this.isModalVisible = false;
            this.messageService.success('创建成功');
          },
          error: (err) => {
            // 错误已在全局拦截器中处理，这里不需要额外处理
          }
        });
    }
  }

  handleModalOk(): void {
    if (this.modalForm.valid) {
      const data: CreateUpdateQualityIndicatorDto = this.modalForm.value;
      this.addEditData(data, this.currentItem ? 'update' : 'create');
    } else {
      Object.values(this.modalForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  allDel(): void {
    if (this.checkedCashArray.length > 0) {
      const tempArrays: string[] = [];
      this.modalService.confirm({
        nzTitle: '确定要删除吗？',
        nzContent: '删除后不可恢复',
        nzOnOk: () => {
          this.checkedCashArray.forEach(item => {
            tempArrays.push(item.id);
          });
          this.tableLoading(true);
          this.qualityIndicatorService
            .deleteByIds(tempArrays)
            .pipe(
              finalize(() => {
                this.tableLoading(false);
              }),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
              if (this.dataList.length === 1) {
                this.tableConfig.pageIndex--;
              }
              this.getDataList();
              this.checkedCashArray = [];
            });
        }
      });
    } else {
      this.messageService.error('请勾选数据');
      return;
    }
  }

  del(id: string): void {
    const ids: string[] = [id];
    this.modalService.confirm({
      nzTitle: '确定要删除吗？',
      nzContent: '删除后不可恢复',
      nzOnOk: () => {
        this.tableLoading(true);
        this.qualityIndicatorService
          .deleteById(ids.join(','))
          .pipe(
            finalize(() => {
              this.tableLoading(false);
            }),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(() => {
            // 例如分页第二页只有一条数据，此时删除这条数据，跳转到第一页，并重新查询一下列表,pageIndex改变会由changePageIndex自动触发表格查询getDataList（）
            if (this.dataList.length === 1 && this.tableConfig.pageIndex !== 1) {
              this.tableConfig.pageIndex--;
            } else {
              this.getDataList();
            }
          });
      }
    });
  }

  getJudgmentTags(item: QualityIndicatorDto): string[] {
    const tags = [];
    if (item.isCritical) tags.push('CR');
    return tags;
  }

  getTagColor(tag: string): string {
    switch (tag) {
      case 'CR': return 'error';
      case 'MAJ': return 'warning';
      case 'MIN': return 'success';
      default: return 'default';
    }
  }

  // 搜索方法
  onSearch(): void {
    this.getDataList({ pageIndex: 1 });
  }

  // 判定规则相关方法
  handleInspectionRulesCancel(): void {
    this.isInspectionRulesVisible = false;
  }

  showAddInspectionRuleModal(): void {
    this.currentInspectionRule = null;
    this.inspectionRuleForm.reset({
      name: '',
      severityLevel: '',
      priority: 0,
      conditionExpression: '',
      judgmentResult: '',
      description: '',
      executeAction: '',
      remark: ''
    });
    this.isInspectionRuleModalVisible = true;
  }

  showEditInspectionRuleModal(rule: InspectionRuleDto): void {
    this.currentInspectionRule = rule;
    this.inspectionRuleForm.patchValue({
      name: rule.name,
      severityLevel: rule.severityLevel,
      priority: rule.priority,
      conditionExpression: rule.conditionExpression,
      judgmentResult: rule.judgmentResult,
      description: rule.description,
      executeAction: rule.executeAction,
      remark: rule.remark
    });
    this.isInspectionRuleModalVisible = true;
  }

  deleteInspectionRule(id: string): void {
    this.modalService.confirm({
      nzTitle: '确定要删除吗？',
      nzContent: '删除后不可恢复',
      nzOnOk: () => {
        return new Promise<void>((resolve) => {
          this.qualityIndicatorService.deleteInspectionRule(id).subscribe({
            next: () => {
              this.messageService.success('删除成功');
              this.loadInspectionRules();
              resolve();
            },
            error: () => {
              this.messageService.error('删除失败');
              resolve();
            }
          });
        });
      }
    });
  }

  loadInspectionRules(): void {
    if (!this.currentInspectionItem?.id) return;
    this.inspectionRulesLoading = true;
    this.qualityIndicatorService.getInspectionRules(this.currentInspectionItem.id).subscribe({
      next: (rules) => {
        this.inspectionRules = rules;
        this.inspectionRulesLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.inspectionRulesLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  handleInspectionRuleModalCancel(): void {
    this.isInspectionRuleModalVisible = false;
  }

  handleInspectionRuleModalOk(): void {
    if (this.inspectionRuleForm.valid) {
      // 这里需要调用保存判定规则的API
      this.isInspectionRuleModalVisible = false;
      this.messageService.success(this.currentInspectionRule ? '更新成功' : '创建成功');
      // 重新加载判定规则列表
    } else {
      Object.values(this.inspectionRuleForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
