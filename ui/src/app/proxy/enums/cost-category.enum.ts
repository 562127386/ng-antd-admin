import { mapEnumToOptions } from '@abp/ng.core';

export enum CostCategory {
  Rework = 1,
  Compensation = 2,
  ReturnFreight = 3,
  Inspection = 4,
  Repair = 5,
  CustomerLoss = 6,
  ReputationLoss = 7
}

export const costCategoryOptions = mapEnumToOptions(CostCategory);
