export enum SeverityLevel {
  Fatal = 1,
  Severe = 2,
  Normal = 3,
  Minor = 4
}

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

export enum CostType {
  Direct = 1,
  Indirect = 2
}

export enum CostCategory {
  Rework = 1,
  Compensation = 2,
  ReturnFreight = 3,
  Inspection = 4,
  Repair = 5,
  CustomerLoss = 6,
  ReputationLoss = 7
}

export enum NotificationType {
  NewComplaint = 1,
  Assignment = 2,
  StatusChange = 3,
  Reminder = 4,
  Escalation = 5,
  ApprovalRequired = 6,
  ApprovalResult = 7,
  Comment = 8,
  Mention = 9,
  UploadProgress = 10,
  DownloadReady = 11
}

export enum ReminderType {
  PendingResponse = 1,
  ResponseApproaching = 2,
  ResponseTimeout = 3,
  ProcessingApproaching = 4,
  ProcessingTimeout = 5,
  ApprovalPending = 6,
  CustomerConfirmPending = 7
}

export enum TraceType {
  IQC = 1,
  IPQC = 2,
  FQC = 3,
  OQC = 4,
  Production = 5,
  Material = 6,
  Supplier = 7,
  Historical = 8
}

export const SEVERITY_LEVEL_NAMES: Record<SeverityLevel, string> = {
  [SeverityLevel.Fatal]: '致命级',
  [SeverityLevel.Severe]: '严重级',
  [SeverityLevel.Normal]: '一般级',
  [SeverityLevel.Minor]: '轻微级'
};

export const COMPLAINT_STATUS_NAMES: Record<ComplaintStatus, string> = {
  [ComplaintStatus.Pending]: '待接收',
  [ComplaintStatus.PendingResponse]: '待响应',
  [ComplaintStatus.QuickResponse]: '快速响应',
  [ComplaintStatus.RootCauseAnalysis]: '根源解决',
  [ComplaintStatus.PendingApproval]: '待审批',
  [ComplaintStatus.PendingCustomerConfirm]: '待客户确认',
  [ComplaintStatus.Closed]: '已结案',
  [ComplaintStatus.Archived]: '已关闭'
};

export const COMPLAINT_8D_STATUS_NAMES: Record<Complaint8DStatus, string> = {
  [Complaint8DStatus.NotStarted]: '未开始',
  [Complaint8DStatus.D1InProgress]: 'D1组建团队',
  [Complaint8DStatus.D2InProgress]: 'D2问题描述',
  [Complaint8DStatus.D3InProgress]: 'D3临时措施',
  [Complaint8DStatus.D4InProgress]: 'D4根本原因',
  [Complaint8DStatus.D5InProgress]: 'D5永久措施',
  [Complaint8DStatus.D6InProgress]: 'D6实施跟踪',
  [Complaint8DStatus.D7InProgress]: 'D7预防措施',
  [Complaint8DStatus.D8Completed]: 'D8结案'
};

export const COST_CATEGORY_NAMES: Record<CostCategory, string> = {
  [CostCategory.Rework]: '返工费',
  [CostCategory.Compensation]: '赔偿费',
  [CostCategory.ReturnFreight]: '退换货运费',
  [CostCategory.Inspection]: '检测费',
  [CostCategory.Repair]: '维修费',
  [CostCategory.CustomerLoss]: '客户流失损失',
  [CostCategory.ReputationLoss]: '声誉损失'
};
