import type { AuditedEntityDto, EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { Complaint8DStatus } from '../../../enums/complaint8-dstatus.enum';
import type { UploadFileDto } from '../../../upload-files/models';
import type { CostType } from '../../../enums/cost-type.enum';
import type { CostCategory } from '../../../enums/cost-category.enum';
import type { SeverityLevel } from '../../../enums/severity-level.enum';
import type { ComplaintStatus } from '../../../enums/complaint-status.enum';
import type { InspectionStatus } from './inspection-status.enum';
import type { InspectionResult } from './inspection-result.enum';

export interface AssignComplaintDto {
  assigneeId?: string;
  assigneeName?: string | null;
  team?: string | null;
  remark?: string | null;
}

export interface BatchFlowTraceDto {
  batchFlows?: ProductBatchFlowDto[] | null;
  deliveries?: DeliveryDetailDto[] | null;
  inventories?: InventoryDistributionDto[] | null;
  endCustomers?: CustomerDto[] | null;
}

export interface Complaint8DDto extends AuditedEntityDto<string> {
  complaintId?: string;
  complaintNo?: string | null;
  status?: Complaint8DStatus;
  statusName?: string;
  d1_TeamMembers?: string | null;
  d2_ProblemDetails?: string | null;
  d2_Photos?: string | null;
  d3_ContainmentAction?: string | null;
  d3_VerificationResult?: string | null;
  d4_RootCauses?: string | null;
  d4_AnalysisTools?: string | null;
  d5_CorrectiveActions?: string | null;
  d6_ImplementationTrack?: string | null;
  d7_Standardization?: string | null;
  d8_Conclusion?: string | null;
  d8_ClosureDate?: string | null;
  customerConfirmation?: boolean;
  completionDate?: string | null;
  d1_CompletedTime?: string | null;
  d2_CompletedTime?: string | null;
  d3_CompletedTime?: string | null;
  d4_CompletedTime?: string | null;
  d5_CompletedTime?: string | null;
  d6_CompletedTime?: string | null;
  d7_CompletedTime?: string | null;
}

export interface ComplaintAttachmentDto extends AuditedEntityDto<string> {
  complaintId?: string;
  complaintNo?: string | null;
  fileName?: string;
  filePath?: string | null;
  fileType?: string | null;
  fileSize?: number;
  related8DStep?: string | null;
  uploadedBy?: string | null;
  uploadedByName?: string | null;
}

export interface ComplaintCommentDto extends AuditedEntityDto<string> {
  complaintId?: string;
  complaintNo?: string | null;
  content?: string;
  mentionedUsers?: string | null;
  parentId?: string | null;
  creatorName?: string | null;
  replies?: ComplaintCommentDto[] | null;
  files?: UploadFileDto[];
}

export interface ComplaintCostDto extends AuditedEntityDto<string> {
  complaintId?: string;
  complaintNo?: string | null;
  costType?: CostType;
  costTypeName?: string;
  costCategory?: CostCategory;
  costCategoryName?: string;
  amount?: number;
  description?: string | null;
  recordedBy?: string | null;
  recordedByName?: string | null;
}

export interface ComplaintDashboardDto {
  totalComplaints?: number;
  pendingComplaints?: number;
  inProgressComplaints?: number;
  closedComplaints?: number;
  overdueComplaints?: number;
  repeatComplaints?: number;
  averageProcessingHours?: number;
  closureRate?: number;
  slaComplianceRate?: number;
  severityDistribution?: SeverityDistributionDto[];
  statusDistribution?: StatusDistributionDto[];
  trendData?: TrendDataDto[];
}

export interface ComplaintDto extends AuditedEntityDto<string> {
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
  severityLevelName?: string;
  occurrenceTime?: string | null;
  expectedResolution?: string | null;
  status?: ComplaintStatus;
  statusName?: string;
  assignedTo?: string | null;
  assignedToName?: string | null;
  assignedTeam?: string | null;
  responseDueTime?: string | null;
  resolutionDueTime?: string | null;
  actualResponseTime?: string | null;
  actualResolutionTime?: string | null;
  is8DRequired?: boolean;
  eightDStatus?: Complaint8DStatus | null;
  eightDStatusName?: string | null;
  totalCost?: number;
  remark?: string | null;
  sourceChannel?: string | null;
  isOverdue?: boolean;
  overdueInfo?: string | null;
  sn?: string | null;
}

export interface ComplaintStatusLogDto extends EntityDto<string> {
  complaintId?: string;
  fromStatus?: ComplaintStatus | null;
  fromStatusName?: string | null;
  toStatus?: ComplaintStatus;
  toStatusName?: string;
  operatorId?: string | null;
  operatorName?: string | null;
  operationTime?: string;
  remark?: string | null;
}

export interface ComplaintSummaryDto {
  totalCount?: number;
  closedCount?: number;
  overdueCount?: number;
  averageProcessingHours?: number;
  slaComplianceRate?: number;
  totalQualityCost?: number;
  bySeverity?: Record<string, number>;
  byStatus?: Record<string, number>;
  byProduct?: Record<string, number>;
  byCustomer?: Record<string, number>;
  byTeam?: Record<string, number>;
}

export interface CompleteD8Dto {
  conclusion?: string;
  customerConfirmation?: boolean;
}

export interface CreateUpdateComplaintCommentDto {
  content?: string;
  mentionedUsers?: string | null;
  parentId?: string | null;
  files?: string[] | null;
}

export interface CreateUpdateComplaintCostDto {
  costType?: CostType;
  costCategory?: CostCategory;
  amount?: number;
  description?: string | null;
}

export interface CreateUpdateComplaintDto {
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
  is8DRequired?: boolean;
  remark?: string | null;
  sourceChannel?: string | null;
  sn?: string | null;
}

export interface CustomerDto {
  id?: string;
  customerCode?: string | null;
  customerName?: string | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
}

export interface DefectRecordDto {
  id?: string;
  inspectionOrderId?: string | null;
  defectCode?: string | null;
  defectName?: string | null;
  defectQuantity?: number | null;
  severity?: string | null;
  recordTime?: string | null;
}

export interface DeliveryDetailDto {
  id?: string;
  deliveryNo?: string | null;
  productCode?: string | null;
  batchNo?: string | null;
  quantity?: number | null;
  customerName?: string | null;
  deliveryDate?: string | null;
}

export interface DeliveryRecordDto {
  id?: string;
  deliveryNo?: string | null;
  productCode?: string | null;
  batchNo?: string | null;
  customerName?: string | null;
  deliveryDate?: string | null;
}

export interface EquipmentDto {
  id?: string;
  equipmentCode?: string | null;
  equipmentName?: string | null;
  equipmentType?: string | null;
  status?: string | null;
}

export interface EquipmentLogDto {
  id?: string;
  equipmentCode?: string | null;
  equipmentName?: string | null;
  batchNo?: string | null;
  operationType?: string | null;
  operationTime?: string | null;
}

export interface EquipmentMaintenanceDto {
  id?: string;
  equipmentId?: string | null;
  maintenanceType?: string | null;
  description?: string | null;
  maintenanceDate?: string | null;
}

export interface EquipmentParameterDto {
  id?: string;
  equipmentId?: string | null;
  parameterName?: string | null;
  parameterValue?: string | null;
  recordTime?: string | null;
}

export interface EquipmentTraceDto {
  equipment?: EquipmentDto[] | null;
  parameters?: EquipmentParameterDto[] | null;
  maintenanceRecords?: EquipmentMaintenanceDto[] | null;
  toolingParameters?: ToolingParameterDto[] | null;
}

export interface FQCTraceDto {
  inspectionOrders?: InspectionOrderDto[] | null;
  fqcRecords?: FqcRecordDto[] | null;
}

export interface FqcRecordDto {
  id?: string;
  recordNo?: string | null;
  productCode?: string | null;
  batchNo?: string | null;
  inspectionResult?: string | null;
  qualifiedQuantity?: number | null;
  unqualifiedQuantity?: number | null;
  inspectionDate?: string | null;
}

export interface FullTraceReportDto {
  complaintInfo?: ComplaintDto | null;
  iqc?: IQCTraceDto | null;
  ipqc?: IPQCTraceDto | null;
  fqc?: FQCTraceDto | null;
  oqc?: OQCTraceDto | null;
  production?: ProductionTraceDto | null;
  equipment?: EquipmentTraceDto | null;
  testReports?: TestReportTraceDto | null;
  material?: MaterialTraceDto | null;
  supplier?: SupplierTraceDto | null;
  batchFlow?: BatchFlowTraceDto | null;
  generatedAt?: string;
  generatedBy?: string | null;
}

export interface GetComplaintAttachmentListDto extends PagedAndSortedResultRequestDto {
  related8DStep?: string | null;
}

export interface GetComplaintCommentListDto extends PagedAndSortedResultRequestDto {
  parentId?: string | null;
}

export interface GetComplaintCostListDto extends PagedAndSortedResultRequestDto {
  costType?: CostType | null;
  costCategory?: CostCategory | null;
}

export interface GetComplaintListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  complaintNo?: string | null;
  customerId?: string | null;
  productId?: string | null;
  productBatch?: string | null;
  severityLevel?: SeverityLevel | null;
  status?: ComplaintStatus | null;
  assignedTo?: string | null;
  assignedTeam?: string | null;
  occurrenceDateFrom?: string | null;
  occurrenceDateTo?: string | null;
  creationDateFrom?: string | null;
  creationDateTo?: string | null;
  is8DRequired?: boolean | null;
  isOverdue?: boolean | null;
}

export interface GetComplaintStatusLogListDto extends PagedAndSortedResultRequestDto {}

export interface HistoricalComplaintDto {
  sameProductComplaints?: ComplaintDto[] | null;
  sameBatchComplaints?: ComplaintDto[] | null;
  similarProblemComplaints?: ComplaintDto[] | null;
}

export interface IPQCTraceDto {
  inspectionOrders?: InspectionOrderDto[] | null;
  inspectionRecords?: InspectionRecordDto[] | null;
  defectRecords?: DefectRecordDto[] | null;
}

export interface IQCTraceDto {
  inspectionOrders?: IqcInspectionOrderDto[] | null;
  inspectionRecords?: IqcInspectionRecordDto[] | null;
  nonconformityRecords?: IqcNonconformityRecordDto[] | null;
}

export interface InspectionOrderDto {
  id?: string;
  orderNo?: string | null;
  productId?: string | null;
  productCode?: string | null;
  batchNo?: string | null;
  processName?: string | null;
  status?: InspectionStatus;
  result?: InspectionResult | null;
  inspectionDate?: string | null;
}

export interface InspectionRecordDto {
  id?: string;
  inspectionOrderId?: string | null;
  inspectionItem?: string | null;
  inspectionResult?: string | null;
  measuredValue?: number | null;
  standardValue?: string | null;
  tolerance?: string | null;
  isQualified?: boolean | null;
}

export interface InventoryDistributionDto {
  id?: string;
  productCode?: string | null;
  batchNo?: string | null;
  warehouse?: string | null;
  quantity?: number | null;
}

export interface InventoryRecordDto {
  id?: string;
  materialCode?: string | null;
  batchNo?: string | null;
  quantity?: number | null;
  location?: string | null;
  recordTime?: string | null;
}

export interface IqcInspectionOrderDto {
  id?: string;
  orderNo?: string | null;
  materialCode?: string | null;
  materialName?: string | null;
  supplierName?: string | null;
  batchNo?: string | null;
  status?: InspectionStatus | null;
  result?: InspectionResult | null;
  inspectionDate?: string | null;
}

export interface IqcInspectionRecordDto {
  id?: string;
  inspectionOrderId?: string | null;
  inspectionItem?: string | null;
  inspectionResult?: string | null;
  measuredValue?: number | null;
  unit?: string | null;
  isQualified?: boolean | null;
}

export interface IqcNonconformityRecordDto {
  id?: string;
  inspectionOrderId?: string | null;
  materialCode?: string | null;
  defectDescription?: string | null;
  defectQuantity?: number | null;
  recordDate?: string | null;
}

export interface MaterialBatchDto {
  id?: string;
  materialCode?: string | null;
  batchNo?: string | null;
  quantity?: number | null;
  supplierName?: string | null;
  receivedDate?: string | null;
}

export interface MaterialFlowDto {
  id?: string;
  materialCode?: string | null;
  fromBatchNo?: string | null;
  toBatchNo?: string | null;
  flowType?: string | null;
  flowDate?: string | null;
}

export interface MaterialTraceDto {
  materialBatches?: MaterialBatchDto[] | null;
  materialFlows?: MaterialFlowDto[] | null;
  inventoryRecords?: InventoryRecordDto[] | null;
}

export interface OQCTraceDto {
  oqcRecords?: OqcRecordDto[] | null;
  deliveryRecords?: DeliveryRecordDto[] | null;
}

export interface OperatorRecordDto {
  id?: string;
  operatorCode?: string | null;
  operatorName?: string | null;
  batchNo?: string | null;
  workStation?: string | null;
  workTime?: string | null;
}

export interface OqcRecordDto {
  id?: string;
  recordNo?: string | null;
  productCode?: string | null;
  batchNo?: string | null;
  inspectionResult?: string | null;
  inspectionDate?: string | null;
}

export interface ProcessParameterDto {
  id?: string;
  workOrderId?: string | null;
  parameterName?: string | null;
  parameterValue?: string | null;
  unit?: string | null;
  recordTime?: string | null;
}

export interface ProductBatchFlowDto {
  id?: string;
  productCode?: string | null;
  batchNo?: string | null;
  flowStage?: string | null;
  location?: string | null;
  flowTime?: string | null;
}

export interface ProductionRecordDto {
  id?: string;
  workOrderNo?: string | null;
  outputQuantity?: number | null;
  qualifiedQuantity?: number | null;
  rejectedQuantity?: number | null;
  recordDate?: string | null;
}

export interface ProductionTraceDto {
  workOrders?: WorkOrderDto[] | null;
  processParameters?: ProcessParameterDto[] | null;
  equipmentRecords?: EquipmentLogDto[] | null;
  operators?: OperatorRecordDto[] | null;
  productionRecords?: ProductionRecordDto[] | null;
}

export interface SafetyTestReportDto {
  id?: string;
  reportNo?: string | null;
  productCode?: string | null;
  testResult?: string | null;
  testDate?: string | null;
}

export interface SeverityDistributionDto {
  severity?: string;
  count?: number;
}

export interface StatusDistributionDto {
  status?: string;
  count?: number;
}

export interface SupplierAssessmentDto {
  id?: string;
  supplierId?: string | null;
  assessmentType?: string | null;
  score?: number | null;
  result?: string | null;
  assessmentDate?: string | null;
}

export interface SupplierDto {
  id?: string;
  supplierCode?: string | null;
  supplierName?: string | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
  status?: string | null;
}

export interface SupplierQualificationDto {
  id?: string;
  supplierId?: string | null;
  qualificationType?: string | null;
  certificateNo?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
}

export interface SupplierTraceDto {
  supplierInfo?: SupplierDto | null;
  qualificationRecords?: SupplierQualificationDto[] | null;
  materialBatches?: MaterialBatchDto[] | null;
  assessmentRecords?: SupplierAssessmentDto[] | null;
}

export interface TestReportTraceDto {
  typeTestReports?: TypeTestReportDto[] | null;
  safetyTestReports?: SafetyTestReportDto[] | null;
}

export interface ToolingParameterDto {
  id?: string;
  toolingCode?: string | null;
  parameterName?: string | null;
  parameterValue?: string | null;
  recordTime?: string | null;
}

export interface TrendDataDto {
  date?: string;
  complaintCount?: number;
  closedCount?: number;
  closureRate?: number;
}

export interface TypeTestReportDto {
  id?: string;
  reportNo?: string | null;
  productCode?: string | null;
  batchNo?: string | null;
  testResult?: string | null;
  testDate?: string | null;
}

export interface UpdateD1Dto {
  teamMembers?: string;
}

export interface UpdateD2Dto {
  problemDetails?: string;
  photos?: string | null;
}

export interface UpdateD3Dto {
  containmentAction?: string;
  verificationResult?: string;
}

export interface UpdateD4Dto {
  rootCauses?: string;
  analysisTools?: string | null;
}

export interface UpdateD5Dto {
  correctiveActions?: string;
}

export interface UpdateD6Dto {
  implementationTrack?: string;
}

export interface UpdateD7Dto {
  standardization?: string;
}

export interface UpdateStatusDto {
  newStatus?: ComplaintStatus;
  remark?: string | null;
}

export interface UploadAttachmentDto {
  related8DStep?: string | null;
}

export interface WorkOrderDto {
  id?: string;
  workOrderNo?: string | null;
  productCode?: string | null;
  productName?: string | null;
  batchNo?: string | null;
  quantity?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
}
