import { mapEnumToOptions } from '@abp/ng.core';

export enum InspectionLevel {
  I = 0,
  II = 1,
  III = 2,
  S1 = 3,
  S2 = 4,
  S3 = 5,
  S4 = 6
}

export const inspectionLevelOptions = mapEnumToOptions(InspectionLevel);
