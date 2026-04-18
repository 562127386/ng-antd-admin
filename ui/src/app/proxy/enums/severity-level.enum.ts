import { mapEnumToOptions } from '@abp/ng.core';

export enum SeverityLevel {
  Fatal = 1,
  Severe = 2,
  Normal = 3,
  Minor = 4
}

export const severityLevelOptions = mapEnumToOptions(SeverityLevel);
