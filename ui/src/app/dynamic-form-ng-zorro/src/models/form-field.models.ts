import { Type } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ConditionalRule } from './conditional.models';

export type FormFieldType =
  // Original 18 types
  | 'text' | 'email' | 'number' | 'select' | 'checkbox'
  | 'date' | 'datetime-local' | 'time' | 'textarea'
  | 'password' | 'tel' | 'url' | 'radio' | 'file'
  | 'range' | 'color' | 'group' | 'array'
  // NG-ZORRO additional types
  | 'tree-select' | 'cascader' | 'transfer' | 'switch' | 'auto-complete';

export interface FormFieldConfig<T = any> {
  key: string;
  value?: any;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: OptionProps<T>;
  validators?: ValidatorConfig[];
  conditionalLogic?: ConditionalRule[];
  order?: number;
  gridSize?: number; // 1-12, will be multiplied by 2 for nz-col span
  component?: Type<ControlValueAccessor>;

  // Type-specific attributes
  min?: number | string;
  max?: number | string;
  step?: number | string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  accept?: string;
  multiple?: boolean;

  // Nested form support
  children?: FormFieldConfig[];
  minItems?: number;
  maxItems?: number;

  // ng-zorro specific config
  nzConfig?: NzFieldConfig;
}

export interface NzFieldConfig {
  nzAllowClear?: boolean;
  nzShowSearch?: boolean;
  nzMode?: 'default' | 'multiple' | 'tags';
  nzTreeData?: any[];
  nzCascaderData?: any[];
  nzTransferData?: any[];
  nzMentionSuggestions?: string[];
  uploadConfig?: any;
}

export interface ValidatorConfig {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'min' | 'max' | 'requiredTrue';
  value?: any;
  message: string;
}

export interface OptionProps<T = any> {
  defaultValues?: T[];
  url?: string;
  disabled?: (option: T) => boolean;
  labelProp?: string;
  valueProp?: string;
  apiName?: string;
}
