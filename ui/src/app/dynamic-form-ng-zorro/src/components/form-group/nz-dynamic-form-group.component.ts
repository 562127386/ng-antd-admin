import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalizationPipe } from '@abp/ng.core';
import { FormFieldConfig } from '../../models';
import { NzDynamicFormFieldComponent } from '../form-field/nz-dynamic-form-field.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDynamicFormArrayComponent } from '../form-array/nz-dynamic-form-array.component';

@Component({
  selector: 'nz-dynamic-form-group',
  templateUrl: './nz-dynamic-form-group.component.html',
  styleUrls: ['./nz-dynamic-form-group.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LocalizationPipe,
    NzGridModule,
    NzCollapseModule,
    NzDynamicFormFieldComponent,
    NzDynamicFormArrayComponent,
    NzDynamicFormGroupComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NzDynamicFormGroupComponent {
  groupConfig = input.required<FormFieldConfig>();
  formGroup = input.required<FormGroup>();
  visible = input<boolean>(true);

  get sortedChildren(): FormFieldConfig[] {
    return (this.groupConfig().children || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getChildFormGroup(key: string): FormGroup {
    return this.formGroup().get(key) as FormGroup;
  }
}
