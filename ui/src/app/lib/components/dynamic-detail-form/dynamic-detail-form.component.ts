import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FormFieldConfig, ConditionalRule } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { fnCheckForm } from '@utils/tools';
import { BasicConfirmModalComponent } from '@widget/base-modal';

import { NzSafeAny } from 'ng-zorro-antd/core/types'; 
import { NzGridModule } from 'ng-zorro-antd/grid'; 
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'dynamic-detail-form',
  templateUrl: './dynamic-detail-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
   // A11yModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSelectModule,
    NzSpaceModule,
    NzSwitchModule,
    NzAutocompleteModule,
    NzDividerModule,
    NzTooltipModule,
    NzUploadModule
  ],
  styles: [`
    .lookup-container {
      display: flex;
      align-items: center;
    }
    .lookup-container input[readonly] {
      cursor: pointer;
    }
    .upload-container {
      display: block;
    }
    .ant-form-item {
      margin-bottom: 16px;
    }
  `]
})
export class DynamicDetailFormComponent extends BasicConfirmModalComponent implements OnInit, OnChanges {
  // addEditForm!: FormGroup;
  //readonly nzModalData: Role = inject(NZ_MODAL_DATA);
  //private fb = inject(FormBuilder);
  override modalRef = inject(NzModalRef);

  // initForm(): void {
  //   this.addEditForm = this.fb.group({
  //     name: [null, [Validators.required]],
  //     displayName: [null, [Validators.required]],
  //     description: [null]
  //   });
  // }
  // ngOnInit(): void {
  //   this.initForm();
  //   if (this.nzModalData) {
  //     this.addEditForm.patchValue(this.nzModalData);
  //   }
  // }
  // 此方法为如果有异步数据需要加载，则在该方法中添加
  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  // 返回false则不关闭对话框
  override getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.form)) {
      return of(false);
    }
    return of(this.form.value);
  }

 

  @Input() fields: FormFieldConfig[] = [];
  @Input() values: Record<string, any> = {};
  @Input() submitButtonText: string = '保存';
  @Input() showCancelButton: boolean = true;
  @Input() showResetButton: boolean = false;
  @Input() submitting: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() cardTitle: string = '';

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onFieldChange = new EventEmitter<{ field: string; value: any }>();
  @Output() onLookupOpen = new EventEmitter<FormFieldConfig>();

  form!: FormGroup;
  typeaheadData: Record<string, string[]> = {};
  fileList: Record<string, any[]> = {};
  passwordVisible = false;
  advancedVisible = false;

  get sortedFields(): FormFieldConfig[] {
    const advancedFields = this.fields.filter(f => f.colSpan && f.colSpan >= 2);
    const basicFields = this.fields.filter(f => !f.colSpan || f.colSpan < 2);

    if (this.advancedVisible) {
      return this.fields.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return basicFields.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    console.log('DynamicDetailFormComponent - ngOnInit called');
    console.log('DynamicDetailFormComponent - fields:', this.fields);
    console.log('DynamicDetailFormComponent - values:', this.values);
    this.buildForm();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('DynamicDetailFormComponent - ngOnChanges called');
    console.log('DynamicDetailFormComponent - changes:', changes);
    if (changes['fields']) {
      console.log('DynamicDetailFormComponent - fields changed:', changes['fields']);
      this.buildForm();
      this.cdr.detectChanges();
    }
    if (changes['values'] && this.values) {
      console.log('DynamicDetailFormComponent - values changed:', changes['values']);
      this.patchValues();
      this.cdr.detectChanges();
    }
  }

  buildForm(): void {
    const group: any = {};

    this.fields.forEach(field => {
      const validators = this.getValidators(field);
      let defaultValue = this.values?.[field.key];

      if (defaultValue === undefined || defaultValue === null) {
        defaultValue = field.defaultValue;
      }

      if (field.type === 'multi-select' || field.type === 'checkbox') {
        defaultValue = defaultValue || [];
      }

      group[field.key] = [defaultValue, validators];
    });

    this.form = this.fb.group(group);

    this.form.valueChanges.subscribe(value => {
      this.evaluateConditionalLogic();
      this.onFieldChange.emit({ field: '', value });
    });
  }

  patchValues(): void {
    if (this.form && this.values) {
      this.form.patchValue(this.values, { emitEvent: false });

      Object.keys(this.values).forEach(key => {
        const field = this.fields.find(f => f.key === key);
        if (field?.type === 'lookup') {
          const displayField = key + '_display';
          const displayValue = this.values[displayField] || (field.lookupDisplayField ? this.values[field.lookupDisplayField] : '') || '';
          this.form.patchValue({ [displayField]: displayValue }, { emitEvent: false });
        }
      });
    }
  }

  getValidators(field: FormFieldConfig): Validators[] {
    const validators: Validators[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validation) {
      field.validation.forEach(validation => {
        switch (validation.type) {
          case 'minLength':
            validators.push(Validators.minLength(validation.value));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(validation.value));
            break;
          case 'min':
            validators.push(Validators.min(validation.value));
            break;
          case 'max':
            validators.push(Validators.max(validation.value));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validation.value));
            break;
        }
      });
    }

    return validators;
  }

  getValidationValue(field: FormFieldConfig, type: 'min' | 'max'): number | undefined {
    const rule = field.validation?.find(v => v.type === type);
    return rule?.value;
  }

  getPrecision(field: FormFieldConfig): number | undefined {
    if (field.type === 'currency') return 2;
    if (field.type === 'percentage') return 2;
    return undefined;
  }

  getColSpan(field: FormFieldConfig): number {
    if (field.type === 'textarea') return 24;
    return field.colSpan ? field.colSpan * 12 : 12;
  }

  getLabelSpan(field: FormFieldConfig): number {
    return 6;
  }

  getControlSpan(field: FormFieldConfig): number {
    if (field.type === 'textarea') return 18;
    return field.colSpan ? field.colSpan * 12 : 18;
  }

  isFieldVisible(field: FormFieldConfig): boolean {
    if (field.hidden === true) return false;

    if (field.conditionalLogic && field.conditionalLogic.length > 0) {
      return field.conditionalLogic.every(rule => {
        const dependValue = this.form.get(rule.dependsOn)?.value;
        return this.evaluateCondition(dependValue, rule.condition, rule.value);
      });
    }

    return true;
  }

  isFieldDisabled(field: FormFieldConfig): boolean {
    if (field.disabled) return true;

    if (field.conditionalLogic && field.conditionalLogic.length > 0) {
      return !field.conditionalLogic.every(rule => {
        const dependValue = this.form.get(rule.dependsOn)?.value;
        return this.evaluateCondition(dependValue, rule.condition, rule.value);
      });
    }

    return false;
  }

  private evaluateCondition(value: any, condition: string, ruleValue: any): boolean {
    switch (condition) {
      case 'equals':
        return value === ruleValue;
      case 'notEquals':
        return value !== ruleValue;
      case 'contains':
        return value && typeof value === 'string' && value.includes(ruleValue);
      case 'greaterThan':
        return Number(value) > Number(ruleValue);
      case 'lessThan':
        return Number(value) < Number(ruleValue);
      default:
        return true;
    }
  }

  private evaluateConditionalLogic(): void {
    this.fields.forEach(field => {
      if (field.conditionalLogic && field.conditionalLogic.length > 0) {
        const shouldShow = this.isFieldVisible(field);
        const shouldEnable = !this.isFieldDisabled(field);

        if (shouldShow && !shouldEnable) {
          this.form.get(field.key)?.enable();
        } else if (!shouldShow || !shouldEnable) {
          this.form.get(field.key)?.disable();
        }
      }
    });
  }

  getErrorTip(field: FormFieldConfig): string {
    const control = this.form.get(field.key);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${field.label}不能为空`;
    }
    if (control.errors['minlength']) {
      return `${field.label}至少${control.errors['minlength'].requiredLength}个字符`;
    }
    if (control.errors['maxlength']) {
      return `${field.label}最多${control.errors['maxlength'].requiredLength}个字符`;
    }
    if (control.errors['min']) {
      return `${field.label}最小值为${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `${field.label}最大值为${control.errors['max'].max}`;
    }
    if (control.errors['pattern']) {
      return `${field.label}格式不正确`;
    }

    return '';
  }

  submit(): void {
    if (this.form.valid) {
      const formValue = { ...this.form.getRawValue() };

      Object.keys(formValue).forEach(key => {
        const field = this.fields.find(f => f.key === key);
        if (field?.type === 'lookup') {
          const displayKey = key + '_display';
          delete formValue[displayKey];
        }
      });

      this.onSubmit.emit(formValue);
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }

  reset(): void {
    this.form.reset();
    this.fileList = {};
  }

  toggleAdvanced(): void {
    this.advancedVisible = !this.advancedVisible;
  }

  openLookup(field: FormFieldConfig): void {
    this.onLookupOpen.emit(field);
  }

  onTypeaheadSearch(value: string | Event, field: FormFieldConfig): void {
    const searchValue = typeof value === 'string' ? value : (value as any).target?.value || '';
    if (field.lookupApi) {
      this.typeaheadData[field.key] = ['选项1', '选项2', '选项3'];
    }
  }

  onTypeaheadSelect(value: any, field: FormFieldConfig): void {
    this.onFieldChange.emit({ field: field.key, value });
  }

  onCheckboxChange(event: any, field: FormFieldConfig): void {
    const values = event || [];
    this.form.get(field.key)?.setValue(values);
    this.onFieldChange.emit({ field: field.key, value: values });
  }

  onFileChange(event: any, field: FormFieldConfig): void {
    const fileList = event.fileList.map((file: any) => {
      if (file.response) {
        return file.response.url || file.name;
      }
      return file.name;
    });

    this.fileList[field.key] = event.fileList;
    this.form.get(field.key)?.setValue(fileList.join(','));
    this.onFieldChange.emit({ field: field.key, value: fileList.join(',') });
  }

  get uploadUrl(): string {
    return '/api/upload';
  }

  get uploadHeaders(): any {
    return {};
  }

  get uploadAccept(): string {
    return '.png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx';
  }

  getFieldOptions(field: FormFieldConfig): any[] {
    if (!field.options) return [];
    if (typeof field.options === 'string') {
      try {
        return JSON.parse(field.options);
      } catch (e) {
        return [];
      }
    }
    return field.options;
  }
}
