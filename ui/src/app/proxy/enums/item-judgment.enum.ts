import { mapEnumToOptions } from '@abp/ng.core';

export enum ItemJudgment {
  Pending = 0,
  OK = 1,
  NG = 2
}

export const itemJudgmentOptions = mapEnumToOptions(ItemJudgment);
