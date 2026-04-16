// Utility functions for validators and form helpers
import { ValidatorFn, Validators } from '@angular/forms';
import { ValidatorConfig } from '../models';

export function buildValidatorsFromConfig(validatorConfigs: ValidatorConfig[]): ValidatorFn[] {
  return validatorConfigs.map(config => {
    switch (config.type) {
      case 'required': return Validators.required;
      case 'email': return Validators.email;
      case 'minLength': return Validators.minLength(config.value);
      case 'maxLength': return Validators.maxLength(config.value);
      case 'pattern': return Validators.pattern(config.value);
      case 'min': return Validators.min(config.value);
      case 'max': return Validators.max(config.value);
      case 'requiredTrue': return Validators.requiredTrue;
      default: return Validators.nullValidator;
    }
  });
}
