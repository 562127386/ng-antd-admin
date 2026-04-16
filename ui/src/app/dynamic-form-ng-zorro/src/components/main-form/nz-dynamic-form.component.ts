import {
  ChangeDetectionStrategy, Component, DestroyRef, input, output,
  inject, OnInit, ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalizationPipe } from '@abp/ng.core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormFieldConfig, ConditionalAction } from '../../models';
import { NzDynamicFormService } from '../../services';
import { NzDynamicFormFieldComponent } from '../form-field/nz-dynamic-form-field.component';
import { NzDynamicFormGroupComponent } from '../form-group/nz-dynamic-form-group.component';
import { NzDynamicFormArrayComponent } from '../form-array/nz-dynamic-form-array.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, of } from 'rxjs';
import { fnCheckForm } from '@app/utils/tools';
import { BasicConfirmModalComponent } from '@app/widget/base-modal';
import { CoreModule, CORE_OPTIONS } from '@abp/ng.core';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { environment } from '../../../../../environments/environment';


import { VALIDATION_BLUEPRINTS, VALIDATION_ERROR_TEMPLATE, VALIDATION_INVALID_CLASSES, VALIDATION_MAP_ERRORS_FN, VALIDATION_TARGET_SELECTOR, VALIDATION_VALIDATE_ON_SUBMIT } from '@ngx-validate/core';

@Component({
  selector: 'nz-dynamic-form',
  templateUrl: './nz-dynamic-form.component.html',
  styleUrls: ['./nz-dynamic-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    NgxValidateCoreModule,
    NzButtonModule,
    NzGridModule,
    NzCardModule,
    LocalizationPipe,
    NzDynamicFormFieldComponent,
    NzDynamicFormGroupComponent,
    NzDynamicFormArrayComponent,
  ],
  providers: [
    { provide: CORE_OPTIONS, useValue: environment },
    { provide: VALIDATION_BLUEPRINTS, useValue: [] },
    { provide: VALIDATION_ERROR_TEMPLATE, useValue: null },
    { provide: VALIDATION_INVALID_CLASSES, useValue: ['is-invalid'] },
    { provide: VALIDATION_MAP_ERRORS_FN, useValue: (err:any) => err },
    { provide: VALIDATION_TARGET_SELECTOR, useValue: '.form-control' },
    { provide: VALIDATION_VALIDATE_ON_SUBMIT, useValue: false },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'nz-dynamic-form',
})
export class NzDynamicFormComponent  extends BasicConfirmModalComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('DynamicDetailFormComponent - ngOnChanges called');
    console.log('DynamicDetailFormComponent - changes:', changes);
    // if (changes['fields']) {
    //   console.log('DynamicDetailFormComponent - fields changed:', changes['fields']);
    //   this.buildForm();
    //   this.cdr.detectChanges();
    // }
    // if (changes['values'] && this.values) {
    //   console.log('DynamicDetailFormComponent - values changed:', changes['values']);
    //   this.patchValues();
    //   this.cdr.detectChanges();
    // }
  }
  override modalRef = inject(NzModalRef);
  // 此方法为如果有异步数据需要加载，则在该方法中添加
  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }
  // 返回false则不关闭对话框
  override getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.dynamicForm)) {
      return of(false);
    }
    return of(this.dynamicForm.value);
  }


  fields = input<FormFieldConfig[]>([]);
  values = input<Record<string, any>>();
  submitButtonText = input<string>('Submit');
  submitInProgress = input<boolean>(false);
  showCancelButton = input<boolean>(false);

  onSubmit = output<any>();
  formCancel = output<void>();

  private dynamicFormService = inject(NzDynamicFormService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  dynamicForm!: FormGroup;
  fieldVisibility: { [key: string]: boolean } = {};

  // 1. 注入 NZ_MODAL_DATA
  readonly data = inject(NZ_MODAL_DATA);
  
  // 存储从 NZ_MODAL_DATA 中获取的字段和值
  private modalFields: FormFieldConfig[] = [];
  private modalValues: Record<string, any> = {};
  
  ngOnInit(): void {
     // 从注入的数据中获取字段和值
    this.modalFields = this.data?.fields || [];
    this.modalValues = this.data?.values || {};
    this.setupFormAndLogic();
  }

  get sortedFields(): FormFieldConfig[] {
    return this.getCurrentFields().sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // 获取当前字段（优先使用模态框数据，其次使用输入属性）
  private getCurrentFields(): FormFieldConfig[] {
    return this.modalFields.length > 0 ? this.modalFields : this.fields();
  }

  // 获取当前值（优先使用模态框数据，其次使用输入属性）
  private getCurrentValues(): Record<string, any> {
    return Object.keys(this.modalValues).length > 0 ? this.modalValues : this.values() || {};
  }

  submit() {
    if (this.dynamicForm.valid) {
      this.onSubmit.emit(this.dynamicForm.getRawValue());
    } else {
      this.markAllFieldsAsTouched();
      this.focusFirstInvalidField();
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  resetForm() {
    const initialValues = this.dynamicFormService.getInitialValues(this.getCurrentFields());
    this.dynamicForm.reset({ ...initialValues });
    this.cdr.markForCheck();
  }

  isFieldVisible(field: FormFieldConfig): boolean {
    return this.fieldVisibility[field.key] !== false;
  }

  private setupFormAndLogic() {
    this.dynamicForm = this.dynamicFormService.createFormGroup(this.getCurrentFields());
    // 设置表单值
    const currentValues = this.getCurrentValues();
    if (Object.keys(currentValues).length > 0) {
      this.dynamicForm.patchValue(currentValues);
    }
    this.initializeFieldVisibility();
    this.setupConditionalLogic();
    this.cdr.markForCheck();
  }

  private initializeFieldVisibility() {
    this.getCurrentFields().forEach(field => {
      this.fieldVisibility[field.key] = !field.conditionalLogic?.length;
    });
  }

  private setupConditionalLogic() {
    this.getCurrentFields().forEach(field => {
      if (field.conditionalLogic) {
        field.conditionalLogic.forEach(rule => {
          const dependentControl = this.dynamicForm.get(rule.dependsOn);
          if (dependentControl) {
            this.evaluateConditionalLogic(field.key);
            dependentControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => this.evaluateConditionalLogic(field.key));
          }
        });
      }
    });
  }

  private evaluateConditionalLogic(fieldKey: string) {
    const field = this.getCurrentFields().find(f => f.key === fieldKey);
    if (!field?.conditionalLogic) return;

    field.conditionalLogic.forEach(rule => {
      const dependentValue = this.dynamicForm.get(rule.dependsOn)?.value;
      const conditionMet = this.evaluateCondition(dependentValue, rule.condition, rule.value);
      this.applyConditionalAction(fieldKey, rule.action, conditionMet);
    });
  }

  private evaluateCondition(fieldValue: any, condition: string, ruleValue: any): boolean {
    switch (condition) {
      case 'equals': return fieldValue === ruleValue;
      case 'notEquals': return fieldValue !== ruleValue;
      case 'contains': return fieldValue?.includes?.(ruleValue);
      case 'greaterThan': return Number(fieldValue) > Number(ruleValue);
      case 'lessThan': return Number(fieldValue) < Number(ruleValue);
      default: return false;
    }
  }

  private applyConditionalAction(fieldKey: string, action: string, shouldApply: boolean) {
    const control = this.dynamicForm.get(fieldKey);
    switch (action) {
      case ConditionalAction.SHOW:
        this.fieldVisibility[fieldKey] = shouldApply;
        break;
      case ConditionalAction.HIDE:
        this.fieldVisibility[fieldKey] = !shouldApply;
        break;
      case ConditionalAction.ENABLE:
        shouldApply ? control?.enable() : control?.disable();
        break;
      case ConditionalAction.DISABLE:
        shouldApply ? control?.disable() : control?.enable();
        break;
    }
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.dynamicForm.controls).forEach(key => {
      this.dynamicForm.get(key)?.markAsTouched();
    });
  }

  private focusFirstInvalidField() {
    const firstInvalidField = this.sortedFields.find(field => {
      const control = this.dynamicForm.get(field.key);
      return control?.invalid && control.touched;
    });
    if (firstInvalidField) {
      setTimeout(() => {
        const element = document.getElementById(`field-${firstInvalidField.key}`);
        element?.focus();
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  getFieldFormGroup(formGroup: FormGroup, fieldKey: string): FormGroup {
    return formGroup.get(fieldKey) as FormGroup;
  }
}
