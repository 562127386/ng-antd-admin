import { mapEnumToOptions } from '@abp/ng.core';

export enum InspectionResult {
  Qualified = 1,
  Unqualified = 2,
  ConditionalAcceptance = 3
}

export const inspectionResultOptions = mapEnumToOptions(InspectionResult);
