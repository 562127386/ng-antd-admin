import { mapEnumToOptions } from '@abp/ng.core';

export enum SamplingSchemeType {
  AQL = 1,
  CZero = 2,
  Variable = 3,
  Continuous = 4,
  SkipLot = 5
}

export const samplingSchemeTypeOptions = mapEnumToOptions(SamplingSchemeType);
