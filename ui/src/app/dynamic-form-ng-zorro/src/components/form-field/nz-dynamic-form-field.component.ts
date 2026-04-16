import {
  ChangeDetectionStrategy, Component, DestroyRef, inject, InjectionToken,
  Injector, input, OnInit, forwardRef
} from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormControl, FormControlName,
  FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { LocalizationPipe } from '@abp/ng.core';
import { FormFieldConfig } from '../../models';
import { NzDynamicFormService } from '../../services';
import { createSelectFieldConfig, OptionsResolverService } from '../../services/options-resolver.service';
import { Observable, of } from 'rxjs';

// NG-ZORRO imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzGridModule } from 'ng-zorro-antd/grid';


export const NZ_DYNAMIC_FORM_FIELD = new InjectionToken<NzDynamicFormFieldComponent>('NzDynamicFormField');

@Component({
  selector: 'nz-dynamic-form-field',
  templateUrl: './nz-dynamic-form-field.component.html',
  styleUrls: ['./nz-dynamic-form-field.component.scss'],
  providers: [
    { provide: NZ_DYNAMIC_FORM_FIELD, useExisting: NzDynamicFormFieldComponent },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzDynamicFormFieldComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LocalizationPipe,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzRadioModule,
    NzSwitchModule,
    NzUploadModule,
    NzSliderModule,
    NzTreeSelectModule,
    NzCascaderModule,
    NzTransferModule,
    NzAutocompleteModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NzDynamicFormFieldComponent implements OnInit, ControlValueAccessor {
  field = input.required<FormFieldConfig>();
  visible = input<boolean>(true);

  control!: FormControl;
  fieldFormGroup: FormGroup;
  options$: Observable<any[]> = of([]);

  private readonly injector = inject(Injector);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dynamicFormService = inject(NzDynamicFormService);
  private readonly optionsResolver = inject(OptionsResolverService);
  readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.fieldFormGroup = this.formBuilder.group({ value: [''] });
  }

  ngOnInit() {
    const ngControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = this.injector.get(FormGroupDirective).getControl(ngControl as FormControlName);
    }

    this.value?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.onChange(value);
    });

    //this.options$ = this.optionsResolver.resolveOptions(this.field());

    const options = this.field()?.options;
    this.options$ = this.optionsResolver.resolveOptions({
  ...this.field(),        // 复制原有所有属性
  options:(options && Array.isArray(options) && options.length > 0)? createSelectFieldConfig(options) : options     // 覆盖要改的属性
});
    
    // 初始化日期范围限制
    this.minDate = this.getSafeDate(this.field().min);
    this.maxDate = this.getSafeDate(this.field().max);
  }

  writeValue(value: any): void {
    this.value?.setValue(value ?? '');
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.value?.disable() : this.value?.enable();
  }

  get value() { return this.fieldFormGroup.get('value'); }

  get isInvalid(): boolean {
    return this.control ? (this.control.invalid && (this.control.dirty || this.control.touched)) : false;
  }

  get errors(): string[] {
    if (!this.control?.errors) return [];
    const errorKeys = Object.keys(this.control.errors);
    const validators = this.field().validators || [];
    return errorKeys.map(key => {
      const validator = validators.find(v => v.type.toLowerCase() === key.toLowerCase());
      if (validator?.message) return validator.message;
      // Fallback messages
      if (key === 'required') return `${this.field().label} is required`;
      if (key === 'email') return 'Please enter a valid email address';
      if (key === 'minlength') return `Minimum length is ${this.control.errors![key].requiredLength}`;
      if (key === 'maxlength') return `Maximum length is ${this.control.errors![key].requiredLength}`;
      return `${this.field().label} is invalid`;
    });
  }

  onFileChange(fileList: any[]) {
    const files = fileList.map((f: any) => f.originFileObj || f);
    const value = this.field().multiple ? files : files[0];
    this.value?.setValue(value);
    this.onChange(value);
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};



  // 安全获取值，处理 undefined、空字符串场景
  private getSafeDate(value: string | number | undefined | null): Date | null {
    // 空值、undefined、null 都返回 null（不限制）
    if (!value) return null;
    // 合法值才转换为日期
    return new Date(value);
  }
  // 日期范围限制
  minDate: Date | null = null;
  maxDate: Date | null = null;
  // 核心禁用逻辑（空值自动跳过判断）
  disabledDate = (current: Date): boolean => {
    // 只有 minDate 存在，才判断“小于最小日期”
    const beforeMin = this.minDate ? current < this.minDate : false;
    // 只有 maxDate 存在，才判断“大于最大日期”
    const afterMax = this.maxDate ? current > this.maxDate : false;
    // 满足任意一个就禁用
    return beforeMin || afterMax;
  };
}
