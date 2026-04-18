import { mapEnumToOptions } from '@abp/ng.core';

export enum InspectionStandardStatus {
  Draft = 1,
  Active = 2,
  Inactive = 3
}

export const inspectionStandardStatusOptions = mapEnumToOptions(InspectionStandardStatus);
