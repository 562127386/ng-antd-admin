import { mapEnumToOptions } from '@abp/ng.core';

export enum ReminderType {
  PendingResponse = 1,
  ResponseApproaching = 2,
  ResponseTimeout = 3,
  ProcessingApproaching = 4,
  ProcessingTimeout = 5,
  ApprovalPending = 6,
  CustomerConfirmPending = 7
}

export const reminderTypeOptions = mapEnumToOptions(ReminderType);
