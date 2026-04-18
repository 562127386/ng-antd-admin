import { mapEnumToOptions } from '@abp/ng.core';

export enum ReviewResult {
  Rework = 1,
  Repair = 2,
  Concession = 3,
  Scrap = 4
}

export const reviewResultOptions = mapEnumToOptions(ReviewResult);
