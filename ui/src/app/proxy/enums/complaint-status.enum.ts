import { mapEnumToOptions } from '@abp/ng.core';

export enum ComplaintStatus {
  Pending = 0,
  PendingResponse = 1,
  QuickResponse = 2,
  RootCauseAnalysis = 3,
  PendingApproval = 4,
  PendingCustomerConfirm = 5,
  Closed = 6,
  Archived = 7
}

export const complaintStatusOptions = mapEnumToOptions(ComplaintStatus);
