import { mapEnumToOptions } from '@abp/ng.core';

export enum InspectionStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2
}

export const inspectionStatusOptions = mapEnumToOptions(InspectionStatus);
