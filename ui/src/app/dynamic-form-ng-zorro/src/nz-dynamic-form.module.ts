import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalizationPipe } from '@abp/ng.core';

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
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';

// Components
import { NzDynamicFormComponent } from './components/main-form/nz-dynamic-form.component';
import { NzDynamicFormFieldComponent } from './components/form-field/nz-dynamic-form-field.component';
import { DynamicFormFieldHostComponent } from './components/form-field/nz-dynamic-form-field-host.component';
import { NzDynamicFormGroupComponent } from './components/form-group/nz-dynamic-form-group.component';
import { NzDynamicFormArrayComponent } from './components/form-array/nz-dynamic-form-array.component';

@NgModule({
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
    NzCardModule,
    NzEmptyModule,
    NzCollapseModule
  ],
  exports: [
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
    NzCardModule,
    NzEmptyModule,
    NzCollapseModule
  ]
})
export class NzDynamicFormModule { }