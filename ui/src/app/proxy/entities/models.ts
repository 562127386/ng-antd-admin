import type { CreationAuditedAggregateRoot, FullAuditedAggregateRoot } from '../volo/abp/domain/entities/auditing/models';
import type { SeverityLevel } from '../enums/severity-level.enum';
import type { ComplaintStatus } from '../enums/complaint-status.enum';

export interface Complaint extends FullAuditedAggregateRoot<string> {
  complaintNo?: string;
  customerId?: string | null;
  customerName?: string | null;
  customerContact?: string | null;
  customerEmail?: string | null;
  productId?: string | null;
  productCode?: string | null;
  productName?: string | null;
  productBatch?: string | null;
  problemDescription?: string;
  severityLevel?: SeverityLevel;
  occurrenceTime?: string | null;
  expectedResolution?: string | null;
  status?: ComplaintStatus;
  assignedTo?: string | null;
  assignedToName?: string | null;
  assignedTeam?: string | null;
  responseDueTime?: string | null;
  resolutionDueTime?: string | null;
  actualResponseTime?: string | null;
  actualResolutionTime?: string | null;
  is8DRequired?: boolean;
  totalCost?: number;
  remark?: string | null;
  sourceChannel?: string | null;
  sn?: string | null;
}

export interface ComplaintComment extends CreationAuditedAggregateRoot<string> {
  complaintId?: string;
  content?: string;
  mentionedUsers?: string | null;
  parentId?: string | null;
  creatorName?: string | null;
}
