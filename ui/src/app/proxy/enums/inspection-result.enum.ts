import { mapEnumToOptions } from '@abp/ng.core';

export enum InspectionResult {
  Accepted = 1,
  Concession = 2,
  Rejected = 3,
  Sorting = 4
}

export const inspectionResultOptions = mapEnumToOptions(InspectionResult);
