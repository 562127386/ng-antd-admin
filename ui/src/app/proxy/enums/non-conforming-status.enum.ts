import { mapEnumToOptions } from '@abp/ng.core';

export enum NonConformingStatus {
  PendingReview = 1,
  Reviewing = 2,
  PendingDisposal = 3,
  Disposing = 4,
  Completed = 5
}

export const nonConformingStatusOptions = mapEnumToOptions(NonConformingStatus);
