import { mapEnumToOptions } from '@abp/ng.core';

export enum Complaint8DStatus {
  NotStarted = 0,
  D1InProgress = 1,
  D2InProgress = 2,
  D3InProgress = 3,
  D4InProgress = 4,
  D5InProgress = 5,
  D6InProgress = 6,
  D7InProgress = 7,
  D8Completed = 8
}

export const complaint8DStatusOptions = mapEnumToOptions(Complaint8DStatus);
