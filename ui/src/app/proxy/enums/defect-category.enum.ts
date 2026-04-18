import { mapEnumToOptions } from '@abp/ng.core';

export enum DefectCategory {
  Appearance = 1,
  Dimension = 2,
  Performance = 3,
  Packaging = 4
}

export const defectCategoryOptions = mapEnumToOptions(DefectCategory);
