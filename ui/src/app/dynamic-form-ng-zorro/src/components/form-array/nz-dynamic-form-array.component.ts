import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalizationPipe } from '@abp/ng.core';
import { FormFieldConfig } from '../../models';
import { NzDynamicFormService } from '../../services';
import { NzDynamicFormFieldComponent } from '../form-field/nz-dynamic-form-field.component';
import { NzDynamicFormGroupComponent } from '../form-group/nz-dynamic-form-group.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';


@Component({
  selector: 'nz-dynamic-form-array',
  templateUrl: './nz-dynamic-form-array.component.html',
  styleUrls: ['./nz-dynamic-form-array.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LocalizationPipe,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzEmptyModule,
    NzGridModule,
    NzDynamicFormFieldComponent,
    NzDynamicFormGroupComponent,
    NzDynamicFormArrayComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NzDynamicFormArrayComponent {
  arrayConfig = input.required<FormFieldConfig>();
  formGroup = input.required<FormGroup>();
  visible = input<boolean>(true);

  private dynamicFormService = inject(NzDynamicFormService);

  get formArray(): FormArray {
    return this.formGroup().get(this.arrayConfig().key) as FormArray;
  }

  get sortedChildren(): FormFieldConfig[] {
    return (this.arrayConfig().children || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  get canAddItem(): boolean {
    const maxItems = this.arrayConfig().maxItems;
    return maxItems ? this.formArray.length < maxItems : true;
  }

  get canRemoveItem(): boolean {
    const minItems = this.arrayConfig().minItems || 0;
    return this.formArray.length > minItems;
  }

  addItem() {
    if (!this.canAddItem) return;
    const itemGroup = this.dynamicFormService.createFormGroup(this.arrayConfig().children || []);
    this.formArray.push(itemGroup);
  }

  removeItem(index: number) {
    if (!this.canRemoveItem) return;
    this.formArray.removeAt(index);
  }

  getItemFormGroup(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }

  trackByIndex(index: number): number {
    return index;
  }

  getFieldFormGroup(formGroup: FormGroup, fieldKey: string): FormGroup {
    return formGroup.get(fieldKey) as FormGroup;
  }
}
