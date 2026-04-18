import { mapEnumToOptions } from '@abp/ng.core';

export enum MaterialType {
  RawMaterial = 1,
  SemiProduct = 2,
  FinishedProduct = 3,
  Auxiliary = 4
}

export const materialTypeOptions = mapEnumToOptions(MaterialType);
