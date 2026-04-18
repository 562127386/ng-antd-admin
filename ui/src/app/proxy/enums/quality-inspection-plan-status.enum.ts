import { mapEnumToOptions } from '@abp/ng.core';

export enum QualityInspectionPlanStatus {
  Draft = 1,
  Active = 2,
  Inactive = 3
}

export const qualityInspectionPlanStatusOptions = mapEnumToOptions(QualityInspectionPlanStatus);
