# @abp/ng.dynamic-form-ng-zorro

ABP Dynamic Form component with NG-ZORRO UI. This package provides a powerful dynamic form solution based on ng-zorro-antd components.

## Features

- **23 Field Types**: text, email, number, select, checkbox, date, datetime-local, time, textarea, password, tel, url, radio, file, range, color, group, array, tree-select, cascader, transfer, switch, auto-complete
- **Validation**: required, email, minLength, maxLength, min, max, pattern, requiredTrue
- **Conditional Logic**: Show/hide/enable/disable fields based on other field values
- **Nested Forms**: Support for nested groups and dynamic arrays
- **Custom Components**: Integration with ControlValueAccessor
- **ABP Integration**: Localization support via abpLocalization pipe
- **Accessibility**: ARIA attributes and keyboard navigation

## Installation

```bash
npm install @abp/ng.dynamic-form-ng-zorro
```

## Peer Dependencies

- @angular/core ^17.0.0
- @angular/common ^17.0.0
- @angular/forms ^17.0.0
- @abp/ng.core >=10.2.0
- @abp/ng.theme.shared >=10.2.0
- ng-zorro-antd ^17.0.0
- rxjs ~7.8.0

## Basic Usage

```typescript
import { NzDynamicFormComponent } from '@abp/ng.dynamic-form-ng-zorro';
import { FormFieldConfig } from '@abp/ng.dynamic-form-ng-zorro';

@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [NzDynamicFormComponent],
  template: `
    <nz-dynamic-form
      [fields]="formFields"
      [submitButtonText]="'Submit'"
      [showCancelButton]="true"
      (onSubmit)="handleSubmit($event)"
      (formCancel)="handleCancel()"
    />
  `,
})
export class MyFormComponent {
  formFields: FormFieldConfig[] = [
    {
      key: 'firstName',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
      order: 1,
    },
    {
      key: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      order: 2,
    },
  ];

  handleSubmit(formValue: any) {
    console.log('Form submitted:', formValue);
  }

  handleCancel() {
    console.log('Form cancelled');
  }
}
```

## API Reference

See the plan file at `C:\Users\Administrator\AppData\Roaming\Lingma\SharedClientCache\cli\specs\ng-zorro-dynamic-form.md` for complete documentation.

## License

LGPL-3.0
