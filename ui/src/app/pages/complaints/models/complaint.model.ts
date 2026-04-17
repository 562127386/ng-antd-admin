import { SeverityLevel, ComplaintStatus, Complaint8DStatus, NotificationType } from './enums';

export interface Complaint {
  id?: string;
  complaintNo?: string;
  customerId?: string;
  customerName?: string;
  customerContact?: string;
  customerEmail?: string;
  productId?: string;
  productCode?: string;
  productName?: string;
  productBatch?: string;
  problemDescription?: string;
  severityLevel?: SeverityLevel;
  severityLevelName?: string;
  occurrenceTime?: Date;
  expectedResolution?: string;
  status?: ComplaintStatus;
  statusName?: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedTeam?: string;
  responseDueTime?: Date;
  resolutionDueTime?: Date;
  actualResponseTime?: Date;
  actualResolutionTime?: Date;
  is8DRequired?: boolean;
  eightDStatus?: Complaint8DStatus;
  eightDStatusName?: string;
  totalCost?: number;
  remark?: string;
  sourceChannel?: string;
  isOverdue?: boolean;
  overdueInfo?: string;
  creationTime?: Date;
}

export interface Complaint8D {
  id?: string;
  complaintId?: string;
  complaintNo?: string;
  status?: Complaint8DStatus;
  statusName?: string;
  d1_TeamMembers?: string;
  d2_ProblemDetails?: string;
  d2_Photos?: string;
  d3_ContainmentAction?: string;
  d3_VerificationResult?: string;
  d4_RootCauses?: string;
  d4_AnalysisTools?: string;
  d5_CorrectiveActions?: string;
  d6_ImplementationTrack?: string;
  d7_Standardization?: string;
  d8_Conclusion?: string;
  d8_ClosureDate?: Date;
  customerConfirmation?: boolean;
  completionDate?: Date;
  d1_CompletedTime?: Date;
  d2_CompletedTime?: Date;
  d3_CompletedTime?: Date;
  d4_CompletedTime?: Date;
  d5_CompletedTime?: Date;
  d6_CompletedTime?: Date;
  d7_CompletedTime?: Date;
}

export interface ComplaintCost {
  id?: string;
  complaintId?: string;
  complaintNo?: string;
  costType?: number;
  costTypeName?: string;
  costCategory?: number;
  costCategoryName?: string;
  amount?: number;
  description?: string;
  recordedBy?: string;
  recordedByName?: string;
}

export interface ComplaintAttachment {
  id?: string;
  complaintId?: string;
  complaintNo?: string;
  fileName?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  related8DStep?: string;
  uploadedBy?: string;
  uploadedByName?: string;
}

export interface ComplaintStatusLog {
  id?: string;
  complaintId?: string;
  fromStatus?: ComplaintStatus;
  fromStatusName?: string;
  toStatus?: ComplaintStatus;
  toStatusName?: string;
  operatorId?: string;
  operatorName?: string;
  operationTime?: Date;
  remark?: string;
}

export interface ComplaintComment {
  id?: string;
  complaintId?: string;
  complaintNo?: string;
  content?: string;
  mentionedUsers?: string;
  parentId?: string;
  creatorId?: string;
  creatorName?: string;
  creationTime?: Date;
  replies?: ComplaintComment[];
}

export interface ComplaintNotification {
  id?: string;
  type?: NotificationType;
  typeName?: string;
  complaintId?: string;
  complaintNo?: string;
  severityLevel?: SeverityLevel;
  severityLevelName?: string;
  title?: string;
  message?: string;
  icon?: string;
  color?: string;
  data?: Record<string, any>;
  createdAt?: Date;
  expiresAt?: Date;
  isRead?: boolean;
}

export interface CreateUpdateComplaint {
  customerId?: string;
  customerName?: string;
  customerContact?: string;
  customerEmail?: string;
  productId?: string;
  productCode?: string;
  productName?: string;
  productBatch?: string;
  problemDescription?: string;
  severityLevel?: SeverityLevel;
  occurrenceTime?: Date;
  expectedResolution?: string;
  is8DRequired?: boolean;
  remark?: string;
  sourceChannel?: string;
}

export interface AssignComplaint {
  assigneeId?: string;
  assigneeName?: string;
  team?: string;
  remark?: string;
}

export interface UpdateStatus {
  newStatus?: ComplaintStatus;
  remark?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface GetComplaintList {
  filter?: string;
  complaintNo?: string;
  customerId?: string;
  productId?: string;
  productBatch?: string;
  severityLevel?: SeverityLevel;
  status?: ComplaintStatus;
  assignedTo?: string;
  assignedTeam?: string;
  occurrenceDateFrom?: Date;
  occurrenceDateTo?: Date;
  creationDateFrom?: Date;
  creationDateTo?: Date;
  is8DRequired?: boolean;
  isOverdue?: boolean;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface ComplaintDashboard {
  totalComplaints?: number;
  pendingComplaints?: number;
  inProgressComplaints?: number;
  closedComplaints?: number;
  overdueComplaints?: number;
  repeatComplaints?: number;
  averageProcessingHours?: number;
  closureRate?: number;
  slaComplianceRate?: number;
  severityDistribution?: { severity: string; count: number }[];
  statusDistribution?: { status: string; count: number }[];
  trendData?: { date: string; complaintCount: number; closedCount: number; closureRate: number }[];
}

export interface FullTraceReport {
  complaintInfo?: Complaint;
  iqc?: any;
  ipqc?: any;
  fqc?: any;
  oqc?: any;
  production?: any;
  equipment?: any;
  testReports?: any;
  material?: any;
  supplier?: any;
  batchFlow?: any;
  generatedAt?: Date;
  generatedBy?: string;
}

export { SeverityLevel };
