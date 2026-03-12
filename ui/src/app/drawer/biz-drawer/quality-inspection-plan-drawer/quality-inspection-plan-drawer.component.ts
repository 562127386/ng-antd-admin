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
    SamplingSchemeConfigComponent
  ],
  templateUrl: './quality-inspection-plan-drawer.component.html',
  styleUrls: ['./quality-inspection-plan-drawer.component.less']
})
export class QualityInspectionPlanDrawerComponent implements OnInit {
  private qualityInspectionPlanService = inject(QualityInspectionPlanService);
  private qualityIndicatorService = inject(QualityIndicatorService);
  private fb = inject(FormBuilder);
  //private modalService = inject(NzModalService);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private qualityIndicatorSelectorService = inject(QualityIndicatorSelectorService);

  params: { mode: 'view' | 'edit' | 'create'; id?: string } = { mode: 'create' };

  loading = false;
  currentStepIndex: number = -1;

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

  ngOnInit(): void {
    this.initForms();
    this.isViewMode = this.params.mode === 'view';
    this.isEdit = this.params.mode === 'edit';
    
    if ((this.params.mode === 'view' || this.params.mode === 'edit') && this.params.id) {
      this.loadQualityInspectionPlan(this.params.id);
    }
  }

  initForms(): void {
    this.createForm = this.fb.group({
      code: ['', [Validators.required]],
      version: ['', [Validators.required]],
      effectiveDate: [null, [Validators.required]],
      expiryDate: [null],
      inspectionType: [null, [Validators.required]],
      samplingSchemeType: [null, [Validators.required]],
      samplingSchemeConfig: [''],
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
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      sortOrder: [0, [Validators.required]],
      isEnabled: [true],
      remark: [''],
      items: this.fb.array([])
    });
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      id: [''],
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
    
    this.qualityIndicatorSelectorService.openSelector().subscribe(selectedItems => {
      if (selectedItems.length === 0) {
        return;
      }

      if (this.currentStepIndex === -1) {
        this.messageService.warning('请先选择一个质检步骤');
        return;
      }

      const itemsFormArray = this.getItemsFormArray(this.currentStepIndex);
      selectedItems.forEach((item, index) => {
        const itemGroup = this.createItemFormGroup();
        itemGroup.patchValue({
          id: item.id,
          code: item.code,
          name: item.name,
          inspectionMethod: 2, // 计数
          standardValue: item.defaultValue,//标准值
          isCritical: item.isCritical,
          sortOrder: itemsFormArray.length + index
        });
        if (this.isViewMode) {
          Object.values(itemGroup.controls).forEach((control) => {
            control.disable();
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
          version: plan.version,
          effectiveDate: plan.effectiveDate,
          expiryDate: plan.expiryDate,
          inspectionType: plan.inspectionType,
          samplingSchemeType: plan.samplingSchemeType,
          samplingSchemeConfig: plan.samplingSchemeConfig
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
    
    // 验证所有步骤和指标
    this.stepsFormArray.controls.forEach(stepGroup => {
      const step = stepGroup as FormGroup;
      const itemsFormArray = step.get('items') as FormArray;
      
      itemsFormArray.controls.forEach(itemGroup => {
        this.validateItemValues(itemGroup as FormGroup);
        if ((itemGroup as FormGroup).invalid) {
          hasInvalidItems = true;
        }
      });
    });

    if (this.createForm.invalid || hasInvalidItems) {
      Object.values(this.createForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      
      // 验证步骤表单
      this.stepsFormArray.controls.forEach(stepGroup => {
        Object.values((stepGroup as FormGroup).controls).forEach(control => {
          control.markAsDirty();
          control.updateValueAndValidity();
        });
      });
      
      if (hasInvalidItems) {
        this.messageService.warning('存在检验项目校验不通过，请检查');
      }
      return of(false);
    }

    // 构建输入对象，将items转换为indicatorIds
    const formValue = this.createForm.value;
    const input: CreateUpdateQualityInspectionPlanDto = {
      ...formValue,
      steps: formValue.steps?.map((step: any) => ({
        ...step,
        indicatorIds: step.items?.map((item: any) => item.id) || [],
        items: step.items //指标会备份一份到检验项目  质检时最终还是按照检验项目检验
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
