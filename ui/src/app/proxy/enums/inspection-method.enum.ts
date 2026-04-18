import { mapEnumToOptions } from '@abp/ng.core';

export enum InspectionMethod {
  Variable = 1,
  Attribute = 2
}

export const inspectionMethodOptions = mapEnumToOptions(InspectionMethod);
