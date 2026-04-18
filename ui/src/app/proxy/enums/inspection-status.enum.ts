import { mapEnumToOptions } from '@abp/ng.core';

export enum InspectionStatus {
  Draft = 0,
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4
}

export const inspectionStatusOptions = mapEnumToOptions(InspectionStatus);
