import { mapEnumToOptions } from '@abp/ng.core';

export enum CostType {
  Direct = 1,
  Indirect = 2
}

export const costTypeOptions = mapEnumToOptions(CostType);
