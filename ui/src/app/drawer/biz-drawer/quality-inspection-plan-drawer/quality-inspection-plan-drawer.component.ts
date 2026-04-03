import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Observable, of, forkJoin } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import {
  QualityInspectionPlanDto, 
  CreateUpdateQualityInspectionPlanDto,
  CreateUpdateInspectionStepDto
} from '@app/pages/base-data/models/quality-inspection-plan.model';
import { QualityInspectionPlanService } from '@app/pages/base-data/services/quality-inspection-plan.service';
import { QualityIndicatorService } from '@app/pages/base-data/services/quality-indicator.service';
import { QualityIndicatorDto } from '@app/pages/base-data/models/quality-indicator.model';
import { SamplingSchemeConfigComponent } from '@app/pages/base-data/components/sampling-scheme-config/sampling-scheme-config.component';
import { QualityIndicatorSelectorService } from '@app/components/quality-indicator-selector';
import { SamplingSchemeService } from '@app/pages/base-data/services/sampling-scheme.service';
import { SamplingSchemeDto } from '@app/pages/base-data/models/sampling-scheme.model';


@Component({
  selector: 'app-quality-inspection-plan-drawer',
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
    NzDatePickerModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzInputNumberModule,
    NzDividerModule,
    NzCheckboxModule,
    NzModalModule,
    NzSpinModule,
    NzGridModule,
    NzSwitchModule,
    NzCollapseModule,
    NzTagModule,
    SamplingSchemeConfigComponent
  ],
  templateUrl: './quality-inspection-plan-drawer.component.html',
  styleUrls: ['./quality-inspection-plan-drawer.component.less']
})
export class QualityInspectionPlanDrawerComponent implements OnInit {
  private qualityInspectionPlanService = inject(QualityInspectionPlanService);
  private qualityIndicatorService = inject(QualityIndicatorService);
  private samplingSchemeService = inject(SamplingSchemeService);
  private fb = inject(FormBuilder);
  //private modalService = inject(NzModalService);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private qualityIndicatorSelectorService = inject(QualityIndicatorSelectorService);
  
  // 抽样方案列表
  samplingSchemes: SamplingSchemeDto[] = [];

  params: { mode: 'view' | 'edit' | 'create'; id?: string } = { mode: 'create' };

  loading = false;
  currentStepIndex: number = -1;
  currentItemIndex: number = -1;
  
  // 判定规则模态框相关
  isRuleModalVisible = false;
  rulesFormArray?: FormArray;
  ruleForm!: FormGroup;

  createForm!: FormGroup;
  isEdit = false;
  isViewMode = false;

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

  inspectionLevelOptions = [
    { label: '一般I', value: 0 },
    { label: '一般II', value: 1 },
    { label: '一般III', value: 2 },
    { label: '特殊S-1', value: 3 },
    { label: '特殊S-2', value: 4 },
    { label: '特殊S-3', value: 5 },
    { label: '特殊S-4', value: 6 }
  ];

  dataTypeOptions = [
    { label: '文本', value: '文本' },
    { label: '数值', value: '数值' },
    { label: '日期', value: '日期' },
    { label: '选择', value: '选择' }
  ];

  ngOnInit(): void {
    this.initForms();
    this.isViewMode = this.params.mode === 'view';
    this.isEdit = this.params.mode === 'edit';
    
    // 加载抽样方案数据
    this.loadSamplingSchemes();
    
    if ((this.params.mode === 'view' || this.params.mode === 'edit') && this.params.id) {
      this.loadQualityInspectionPlan(this.params.id);
    }
  }
  
  // 加载抽样方案数据
  loadSamplingSchemes(): void {
    this.samplingSchemeService.getList({ skipCount: 0, maxResultCount: 1000 }).subscribe({
      next: (result) => {
        this.samplingSchemes = result.items;
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.error('加载抽样方案失败');
      }
    });
  }

  initForms(): void {
    this.createForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      version: ['', [Validators.required]],
      effectiveDate: [null, [Validators.required]],
      expiryDate: [null],
      inspectionType: [null, [Validators.required]],
      samplingSchemeType: [null, [Validators.required]],
      samplingSchemeConfig: [''],
      samplingSchemeId: [''],
      samplingSchemeName: [''],
      inspectionLevel: [''],
      aqlValue: [''],
      remark: [''],
      steps: this.fb.array([])
    });
  }

  get stepsFormArray(): FormArray {
    return this.createForm.get('steps') as FormArray;
  }

  getItemsFormArray(stepIndex: number): FormArray {
    return this.stepsFormArray.at(stepIndex).get('items') as FormArray;
  }

  getStepFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  getStepHeader(index: number, stepGroup: AbstractControl): string {
    const stepName = stepGroup.get('name')?.value || '';
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span>步骤 ${index + 1} ${stepName ? `- ${stepName}` : ''}</span>
        <button nz-button nzType="text" nzDanger (click)="removeStep(${index})" [disabled]="${this.isViewMode}">
          <span nz-icon nzType="delete"></span> 删除
        </button>
      </div>
    `;
  }

  createStepFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      sortOrder: [0, [Validators.required]],
      isEnabled: [true],
      remark: [''],
      samplingSchemeName: [''],
      samplingSchemeId: [''],
      inspectionLevel: [''],
      aqlValue: [''],
      items: this.fb.array([])
    });
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      indicatorId: [null],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      // inspectionMethod: [null, [Validators.required]],
      // standardValue: [null],
      // usl: [null],
      // ucl: [null],
      // lcl: [null],
      // lsl: [null],
      // tool: [''],
      methodDescription: [''],
      frequency: [''],
      isCritical: [false],
      defectSeverity: [null],
      defectCode: [''],
      sortOrder: [0, [Validators.required]],
      // 添加QualityIndicator的其他字段
      indicatorCategory: [''],
      inspectionType: [''],
      dataType: [''],
      unit: [''],
      decimalPlaces: [0],
      remark: [''],
      isEnabled: [true],
      // 判定规则列表
      rules: this.fb.array([])
    });
  }

  createRuleFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
      originalRuleId: [''],
      name: ['', [Validators.required]],
      severityLevel: ['', [Validators.required]],
      priority: [0, [Validators.required]],
      conditionExpression: ['', [Validators.required]],
      judgmentResult: ['', [Validators.required]],
      description: [''],
      executeAction: [''],
      remark: ['']
    });
  }

  getRulesFormArray(itemIndex: number, stepIndex: number): FormArray {
    const stepsFormArray = this.stepsFormArray;
    const stepGroup = stepsFormArray.at(stepIndex) as FormGroup;
    const itemsFormArray = stepGroup.get('items') as FormArray;
    const itemGroup = itemsFormArray.at(itemIndex) as FormGroup;
    return itemGroup.get('rules') as FormArray;
  }

  addRule(stepIndex: number, itemIndex: number): void {
    const rulesFormArray = this.getRulesFormArray(itemIndex, stepIndex);
    const ruleGroup = this.createRuleFormGroup();
    if (this.isViewMode) {
      Object.values(ruleGroup.controls).forEach((control) => {
        control.disable();
      });
    }
    rulesFormArray.push(ruleGroup);
  }

  removeRule(stepIndex: number, itemIndex: number, ruleIndex: number): void {
    const rulesFormArray = this.getRulesFormArray(itemIndex, stepIndex);
    rulesFormArray.removeAt(ruleIndex);
  }

  // 判定规则模态框相关方法
  showRuleModal(itemIndex: number, stepIndex: number): void {
    this.currentItemIndex = itemIndex;
    this.currentStepIndex = stepIndex;
    this.rulesFormArray = this.getRulesFormArray(itemIndex, stepIndex);
    this.isRuleModalVisible = true;
  }

  handleRuleModalCancel(): void {
    this.isRuleModalVisible = false;
    this.currentItemIndex = -1;
    this.currentStepIndex = -1;
  }

  handleRuleModalOk(): void {
    if (!this.rulesFormArray) {
      this.isRuleModalVisible = false;
      this.currentItemIndex = -1;
      this.currentStepIndex = -1;
      return;
    }

    let hasError = false;
    const errorMessages: string[] = [];

    this.rulesFormArray.controls.forEach((ruleGroup, index) => {
      const group = ruleGroup as FormGroup;
      const name = group.get('name')?.value || `规则${index + 1}`;
      
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key);
        if (control?.invalid) {
          hasError = true;
          const errorText = this.getFieldErrorText(key, control?.errors);
          errorMessages.push(`步骤${this.currentStepIndex + 1} - 指标${this.currentItemIndex + 1} - ${name}: ${errorText}`);
        }
      });
    });

    if (hasError) {
      this.messageService.warning(errorMessages.join('\n'));
      return;
    }

    this.isRuleModalVisible = false;
    this.currentItemIndex = -1;
    this.currentStepIndex = -1;
  }

  private getFieldErrorText(fieldName: string, errors: any): string {
    if (!errors) return `${fieldName}填写不正确`;
    
    const fieldLabels: Record<string, string> = {
      name: '规则名称',
      severityLevel: '严重程度',
      priority: '优先级',
      expression: '条件表达式',
      judgment: '判定结果'
    };
    
    const label = fieldLabels[fieldName] || fieldName;
    
    if (errors.required) return `${label}不能为空`;
    if (errors.min) return `${label}不能小于${errors.min.min}`;
    if (errors.max) return `${label}不能大于${errors.max.max}`;
    if (errors.minlength) return `${label}长度不能少于${errors.minlength.requiredLength}`;
    if (errors.maxlength) return `${label}长度不能超过${errors.maxlength.requiredLength}`;
    if (errors.pattern) return `${label}格式不正确`;
    
    return `${label}填写不正确`;
  }

  private getItemFieldErrorText(fieldName: string, errors: any): string {
    if (!errors) return `${fieldName}填写不正确`;
    
    const fieldLabels: Record<string, string> = {
      code: '编码',
      name: '名称',
      sortOrder: '排序',
      indicatorCategory: '指标类别',
      inspectionType: '检验类型',
      dataType: '数据类型',
      unit: '单位',
      decimalPlaces: '小数位数',
      methodDescription: '检验方法',
      frequency: '检验频率',
      isCritical: '是否关键',
      defectSeverity: '缺陷等级',
      defectCode: '缺陷代码',
      remark: '备注',
      version: '版本',
      effectiveDate: '生效日期',
      expiryDate: '失效日期',
      samplingSchemeType: '抽样方案类型'
    };
    
    const label = fieldLabels[fieldName] || fieldName;
    
    if (errors.required) return `${label}不能为空`;
    if (errors.min) return `${label}不能小于${errors.min.min}`;
    if (errors.max) return `${label}不能大于${errors.max.max}`;
    if (errors.minlength) return `${label}长度不能少于${errors.minlength.requiredLength}`;
    if (errors.maxlength) return `${label}长度不能超过${errors.maxlength.requiredLength}`;
    if (errors.pattern) return `${label}格式不正确`;
    
    return `${label}填写不正确`;
  }

  addNewRule(): void {
    if (this.rulesFormArray) {
      const ruleGroup = this.createRuleFormGroup();
      this.rulesFormArray.push(ruleGroup);
    }
  }

  removeRuleFromModal(ruleIndex: number): void {
    if (this.rulesFormArray) {
      this.rulesFormArray.removeAt(ruleIndex);
    }
  }

  getRuleFormGroup(ruleGroup: AbstractControl): FormGroup {
    return ruleGroup as FormGroup;
  }

  getSamplingSchemeTypeText(type: number | undefined): string {
    if (type === undefined) {
      return '';
    }
    const option = this.samplingSchemeTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }
  
  // 处理质检方案的抽样方案选择
  onSamplingSchemeChange(samplingSchemeId: string): void {
    const selectedScheme = this.samplingSchemes.find(s => s.id === samplingSchemeId);
    if (selectedScheme) {
      this.createForm.get('samplingSchemeName')?.setValue(selectedScheme.name);
    } else {
      this.createForm.get('samplingSchemeName')?.setValue('');
    }
  }
  
  // 处理质检步骤的抽样方案选择
  onStepSamplingSchemeChange(samplingSchemeId: string, stepIndex: number): void {
    const selectedScheme = this.samplingSchemes.find(s => s.id === samplingSchemeId);
    if (selectedScheme) {
      this.stepsFormArray.at(stepIndex).get('samplingSchemeName')?.setValue(selectedScheme.name);
    } else {
      this.stepsFormArray.at(stepIndex).get('samplingSchemeName')?.setValue('');
    }
  }

  addStep(): void {
    const stepGroup = this.createStepFormGroup();
    if (this.isViewMode) {
      Object.values(stepGroup.controls).forEach((control) => {
        control.disable();
      });
      const itemsFormArray = stepGroup.get('items') as FormArray;
      itemsFormArray.controls.forEach((itemControl) => {
        const itemGroup = itemControl as FormGroup;
        Object.values(itemGroup.controls).forEach((control) => {
          control.disable();
        });
      });
    }
    this.stepsFormArray.push(stepGroup);
  }

  removeStep(index: number): void {
    this.stepsFormArray.removeAt(index);
  }

  addItem(stepIndex: number): void {
    const itemsFormArray = this.getItemsFormArray(stepIndex);
    const itemGroup = this.createItemFormGroup();
    if (this.isViewMode) {
      Object.values(itemGroup.controls).forEach((control) => {
        control.disable();
      });
    }
    itemsFormArray.push(itemGroup);
  }

  removeItem(stepIndex: number, itemIndex: number): void {
    const itemsFormArray = this.getItemsFormArray(stepIndex);
    itemsFormArray.removeAt(itemIndex);
  }

  showGeneralItemsModal(stepIndex: number): void {
    this.currentStepIndex = stepIndex;
    
    this.qualityIndicatorSelectorService.openSelector().subscribe(async selectedItems => {
      if (selectedItems.length === 0) {
        return;
      }

      if (this.currentStepIndex === -1) {
        this.messageService.warning('请先选择一个质检步骤');
        return;
      }

      for (const item of selectedItems) {
        const rules = await this.qualityIndicatorService.getInspectionRules(item.id).toPromise();
        item.inspectionRules = rules || [];
      }

      const itemsFormArray = this.getItemsFormArray(this.currentStepIndex);
      selectedItems.forEach((item, index) => {
        const itemGroup = this.createItemFormGroup();
        itemGroup.patchValue({
          indicatorId: item.id,
          code: item.code,
          name: item.name,
          // inspectionMethod: item.inspectionType, // 计数
          // standardValue: item.defaultValue,//标准值
          isCritical: item.isCritical,
          sortOrder: itemsFormArray.length + index,
          // 添加QualityIndicator的其他字段
          defaultValue: item.defaultValue,
          indicatorCategory: item.indicatorCategory,
          inspectionType: item.inspectionType,
          dataType: item.dataType,
          unit: item.unit,
          decimalPlaces: item.decimalPlaces,
          remark: item.remark,
          isEnabled: true //item.isEnabled
        });
        if (this.isViewMode) {
          Object.values(itemGroup.controls).forEach((control) => {
            control.disable();
          });
        }
        
        // 如果选中的指标有判定规则，自动添加到rules FormArray
        if (item.inspectionRules && item.inspectionRules.length > 0) {
          const rulesFormArray = itemGroup.get('rules') as FormArray;
          item.inspectionRules.forEach((rule: any) => {
            const ruleGroup = this.createRuleFormGroup();
            ruleGroup.patchValue({
              //id: rule.id || '',  这个id不能把规则的id值搞过来
              originalRuleId: rule.id || '',
              name: rule.name,
              severityLevel: rule.severityLevel,
              priority: rule.priority || 0,
              conditionExpression: rule.conditionExpression,
              judgmentResult: rule.judgmentResult,
              description: rule.description || '',
              executeAction: rule.executeAction || '',
              remark: rule.remark || ''
            });
            if (this.isViewMode) {
              Object.values(ruleGroup.controls).forEach((control) => {
                control.disable();
              });
            }
            rulesFormArray.push(ruleGroup);
          });
        }
        
        itemsFormArray.push(itemGroup);
      });
      this.cdr.markForCheck();
      this.messageService.success(`已添加 ${selectedItems.length} 个质检指标`);
    });
  }

  loadQualityInspectionPlan(id: string): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.qualityInspectionPlanService.get(id).subscribe({
      next: (plan) => {
        // 先更新表单的基本信息，不包括steps
        this.createForm.patchValue({
          code: plan.code,
          name: plan.name,
          version: plan.version,
          effectiveDate: plan.effectiveDate,
          expiryDate: plan.expiryDate,
          inspectionType: plan.inspectionType,
          samplingSchemeType: plan.samplingSchemeType,
          samplingSchemeConfig: plan.samplingSchemeConfig,
          samplingSchemeId: plan.samplingSchemeId,
          inspectionLevel: plan.inspectionLevel,
          aqlValue: plan.aqlValue,
          remark: plan.remark
        });

        // 然后处理steps
        this.stepsFormArray.clear();
        if (plan.steps) {
          plan.steps.forEach(step => {
            const stepGroup = this.createStepFormGroup();
            stepGroup.patchValue(step);
            
            const itemsFormArray = stepGroup.get('items') as FormArray;
            const indicators = (step as any).indicators || step.items;
            if (indicators) {
              indicators.forEach((i: any) => {
                const itemGroup = this.createItemFormGroup();
                itemGroup.patchValue(i);
                
                // 加载判定规则
                if (i.rules && i.rules.length > 0) {
                  const rulesFormArray = itemGroup.get('rules') as FormArray;
                  i.rules.forEach((rule: any) => {
                    const ruleGroup = this.createRuleFormGroup();
                    ruleGroup.patchValue(rule);
                    rulesFormArray.push(ruleGroup);
                  });
                }
                
                itemsFormArray.push(itemGroup);
              });
            }
            
            // 先设置控件的disabled属性，然后再添加到FormArray
            if (this.isViewMode) {
              Object.values(stepGroup.controls).forEach((control) => {
                control.disable();
              });
              itemsFormArray.controls.forEach((itemControl) => {
                const itemGroup = itemControl as FormGroup;
                Object.values(itemGroup.controls).forEach((control) => {
                  control.disable();
                });
                // 禁用判定规则
                const rulesFormArray = itemGroup.get('rules') as FormArray;
                rulesFormArray.controls.forEach((ruleControl) => {
                  const ruleGroup = ruleControl as FormGroup;
                  Object.values(ruleGroup.controls).forEach((control) => {
                    control.disable();
                  });
                });
              });
            }
            
            this.stepsFormArray.push(stepGroup);
            // 通知Angular更新视图
            //this.cdr.markForCheck();
          });
        }

        // 设置表单基本信息的disabled属性
        if (this.isViewMode) {
          Object.values(this.createForm.controls).forEach((control) => {
            control.disable();
          });
        }

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.messageService.error('加载质检方案失败');
        this.cdr.markForCheck();
      }
    });
  }

  validateItemValues(itemGroup: any): void {
    return;//目前不校验 这些字段都被规则表达式替换   这个地方可以增加规则表达式校验20260314
    const group = itemGroup as FormGroup;
    const standardValue = group.get('standardValue')?.value;
    const usl = group.get('usl')?.value;
    const lsl = group.get('lsl')?.value;
    const ucl = group.get('ucl')?.value;
    const lcl = group.get('lcl')?.value;

    const standardValueControl = group.get('standardValue');
    const uslControl = group.get('usl');
    const lslControl = group.get('lsl');
    const uclControl = group.get('ucl');
    const lclControl = group.get('lcl');

    standardValueControl?.setErrors(null);
    uslControl?.setErrors(null);
    lslControl?.setErrors(null);
    uclControl?.setErrors(null);
    lclControl?.setErrors(null);

    if (standardValue !== null && standardValue !== undefined) {
      if (usl !== null && usl !== undefined && standardValue > usl) {
        standardValueControl?.setErrors({ greaterThanUSL: true });
      }
      if (lsl !== null && lsl !== undefined && standardValue < lsl) {
        standardValueControl?.setErrors({ lessThanLSL: true });
      }
      if (ucl !== null && ucl !== undefined && standardValue > ucl) {
        standardValueControl?.setErrors({ greaterThanUCL: true });
      }
      if (lcl !== null && lcl !== undefined && standardValue < lcl) {
        standardValueControl?.setErrors({ lessThanLCL: true });
      }
    }

    if (usl !== null && usl !== undefined && lsl !== null && lsl !== undefined && usl < lsl) {
      uslControl?.setErrors({ uslLessThanLSL: true });
      lslControl?.setErrors({ lslGreaterThanUSL: true });
    }

    if (ucl !== null && ucl !== undefined && lcl !== null && lcl !== undefined && ucl < lcl) {
      uclControl?.setErrors({ uclLessThanLCL: true });
      lclControl?.setErrors({ lclGreaterThanUCL: true });
    }

    if (usl !== null && usl !== undefined && ucl !== null && ucl !== undefined && ucl > usl) {
      uclControl?.setErrors({ uclGreaterThanUSL: true });
    }

    if (lsl !== null && lsl !== undefined && lcl !== null && lcl !== undefined && lcl < lsl) {
      lclControl?.setErrors({ lclLessThanLSL: true });
    }
  }

  getItemValidationClass(controlName: string, itemGroup: any): string {
    const group = itemGroup as FormGroup;
    const control = group.get(controlName);
    if (!control || !control.errors || !control.dirty) {
      return '';
    }
    return 'validation-error';
  }

  getItemValidationMessage(controlName: string, itemGroup: any): string {
    const group = itemGroup as FormGroup;
    const control = group.get(controlName);
    if (!control || !control.errors || !control.dirty) {
      return '';
    }

    const errors = control.errors;
    if (errors['greaterThanUSL']) return '标准值不能大于规格上限';
    if (errors['lessThanLSL']) return '标准值不能小于规格下限';
    if (errors['greaterThanUCL']) return '标准值不能大于控制上限';
    if (errors['lessThanLCL']) return '标准值不能小于控制下限';
    if (errors['uslLessThanLSL']) return '规格上限不能小于规格下限';
    if (errors['lslGreaterThanUSL']) return '规格下限不能大于规格上限';
    if (errors['uclLessThanLCL']) return '控制上限不能小于控制下限';
    if (errors['lclGreaterThanUCL']) return '控制下限不能大于控制上限';
    if (errors['uclGreaterThanUSL']) return '控制上限不能大于规格上限';
    if (errors['lclLessThanLSL']) return '控制下限不能小于规格下限';

    return '';
  }

  isItemValid(itemGroup: any): boolean {
    const group = itemGroup as FormGroup;
    return !group.invalid;
  }

  //保存时调用的
  getCurrentValue(): Observable<NzSafeAny> {
    if (this.isViewMode) {
      return of(true);
    }

    let hasInvalidItems = false;
    const errorMessages: string[] = [];
    
    // 验证所有步骤和指标
    this.stepsFormArray.controls.forEach((stepGroup, stepIndex) => {
      const step = stepGroup as FormGroup;
      const stepName = step.get('name')?.value || `步骤${stepIndex + 1}`;
      const itemsFormArray = step.get('items') as FormArray;
      
      itemsFormArray.controls.forEach((itemGroup, itemIndex) => {
        const group = itemGroup as FormGroup;
        const itemName = group.get('name')?.value || `指标${itemIndex + 1}`;
        
        // 验证item表单
        Object.keys(group.controls).forEach(key => {
          if (key === 'rules') return; // 规则单独验证
          const control = group.get(key);
          if (control?.invalid) {
            hasInvalidItems = true;
            const errorText = this.getItemFieldErrorText(key, control?.errors);
            errorMessages.push(`${stepName} - ${itemName}: ${errorText}`);
          }
        });

        // 验证规则
        const rulesFormArray = group.get('rules') as FormArray;
        if (rulesFormArray) {
          rulesFormArray.controls.forEach((ruleGroup, ruleIndex) => {
            const rule = ruleGroup as FormGroup;
            const ruleName = rule.get('name')?.value || `规则${ruleIndex + 1}`;
            
            Object.keys(rule.controls).forEach(key => {
              const control = rule.get(key);
              if (control?.invalid) {
                hasInvalidItems = true;
                const errorText = this.getFieldErrorText(key, control?.errors);
                errorMessages.push(`${stepName} - ${itemName} - ${ruleName}: ${errorText}`);
              }
            });
          });
        }
      });
    });

    if (this.createForm.invalid || hasInvalidItems) {
      // 验证主表单
      Object.keys(this.createForm.controls).forEach(key => {
        if (key === 'steps') return;
        const control = this.createForm.get(key);
        if (control?.invalid) {
          const errorText = this.getItemFieldErrorText(key, control?.errors);
          errorMessages.push(`基本信息 - ${errorText}`);
        }
      });
      
      // 验证步骤表单
      this.stepsFormArray.controls.forEach((stepGroup, stepIndex) => {
        const step = stepGroup as FormGroup;
        const stepName = step.get('name')?.value || `步骤${stepIndex + 1}`;
        
        Object.keys(step.controls).forEach(key => {
          if (key === 'items') return;
          const control = step.get(key);
          if (control?.invalid) {
            const errorText = this.getItemFieldErrorText(key, control?.errors);
            errorMessages.push(`${stepName}: ${errorText}`);
          }
        });
      });
      
      if (errorMessages.length > 0) {
        const uniqueErrors = [...new Set(errorMessages)];
        this.messageService.warning(uniqueErrors.join('\n'));
      } else {
        this.messageService.warning('存在校验不通过，请检查');
      }
      return of(false);
    }

    // 构建输入对象，将items转换为indicatorIds
    const formValue = this.createForm.value;
    const input: CreateUpdateQualityInspectionPlanDto = {
      ...formValue,
      // 处理aqlValue为空的情况
      aqlValue: formValue.aqlValue === '' || formValue.aqlValue === null || formValue.aqlValue === undefined ? null : formValue.aqlValue,
      // 处理inspectionLevel为空的情况
      inspectionLevel: formValue.inspectionLevel === '' || formValue.inspectionLevel === null || formValue.inspectionLevel === undefined ? null : formValue.inspectionLevel,
      steps: formValue.steps?.map((step: any) => ({
        id: step.id,
        code: step.code,
        name: step.name,
        sortOrder: step.sortOrder,
        isEnabled: step.isEnabled,
        remark: step.remark,
        samplingSchemeName: step.samplingSchemeName,
        samplingSchemeId: step.samplingSchemeId,
        // 处理步骤中inspectionLevel为空的情况
        inspectionLevel: step.inspectionLevel === '' || step.inspectionLevel === null || step.inspectionLevel === undefined ? null : step.inspectionLevel,
        // 处理步骤中aqlValue为空的情况
        aqlValue: step.aqlValue === '' || step.aqlValue === null || step.aqlValue === undefined ? null : step.aqlValue,
        indicatorIds: step.items?.map((item: any) => item.id) || [],
        items: step.items?.map((item: any) => ({
          ...item,
          rules: item.rules || [] // 确保判定规则被传递
        }))
      }))
    };

    if (this.isEdit && this.params.id) {
      return new Observable(subscriber => {
        this.qualityInspectionPlanService.update(this.params.id!, input).subscribe({
          next: () => {
            this.messageService.success('更新成功');
            subscriber.next(true);
            subscriber.complete();
          },
          error: (err) => {
            console.error('Update error:', err);
            this.messageService.error('更新失败');
            subscriber.next(false);
            subscriber.complete();
          }
        });
      });
    } else {
      return new Observable(subscriber => {
        this.qualityInspectionPlanService.create(input).subscribe({
          next: () => {
            this.messageService.success('创建成功');
            subscriber.next(true);
            subscriber.complete();
          },
          error: (err) => {
            console.error('Create error:', err);
            this.messageService.error('创建失败');
            subscriber.next(false);
            subscriber.complete();
          }
        });
      });
    }
  }
}
