import { mapEnumToOptions } from '@abp/ng.core';

export enum DefectSeverity {
  Minor = 1,
  Moderate = 2,
  Major = 3,
  Critical = 4
}

export const defectSeverityOptions = mapEnumToOptions(DefectSeverity);
