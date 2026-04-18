import { mapEnumToOptions } from '@abp/ng.core';

export enum InspectionType {
  IQC = 1,
  IPQC = 2,
  FQC = 3,
  OQC = 4
}

export const inspectionTypeOptions = mapEnumToOptions(InspectionType);
