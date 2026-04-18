import type { ItemJudgment } from '../../enums/item-judgment.enum';
import type { InspectionResult } from '../../enums/inspection-result.enum';
import type { InspectionLevel } from '../../enums/inspection-level.enum';
import type { AuditedEntityDto, CreationAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { InspectionStatus } from '../../enums/inspection-status.enum';

export interface BatchSaveRecordDto {
  inspectionItemId?: string;
  stepCode?: string | null;
  stepName?: string | null;
  itemCode?: string;
  itemName?: string;
  judgment?: ItemJudgment | null;
  defectDescription?: string | null;
  improvementDescription?: string | null;
  remark?: string | null;
  samples?: CreateUpdateIqcInspectionSampleDto[];
}

export interface BatchSaveRecordsDto {
  orderId?: string;
  records?: BatchSaveRecordDto[];
}

export interface CompleteInspectionInput {
  result?: InspectionResult;
  qualifiedSampleCount?: number | null;
  unqualifiedSampleCount?: number | null;
  incompleteSampleCount?: number | null;
  unqualifiedItemCount?: number | null;
  qualifiedItemCount?: number | null;
  pendingItemCount?: number | null;
  remark?: string | null;
}

export interface CreateUpdateIqcInspectionOrderDto {
  purchaseOrderNo?: string | null;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialSpec?: string | null;
  supplierId?: string | null;
  supplierName?: string | null;
  supplierCode?: string | null;
  samplingSchemeCode?: string | null;
  lotSize?: number;
  arrivalDate?: string | null;
  batchNo?: string | null;
  qualityInspectionPlanId?: string | null;
  inspectionPlanCode?: string | null;
  inspectionPlanName?: string | null;
  processId?: string | null;
  processName?: string | null;
  processCode?: string | null;
  organizationId?: string | null;
  organizationCode?: string | null;
  organizationName?: string | null;
  samplingSchemeId?: string | null;
  samplingSchemeName?: string | null;
  inspectionLevel?: InspectionLevel | null;
  aqlValue?: number | null;
  sampleSize?: number | null;
  sampleSizeCode?: string | null;
  acceptanceNumber?: number | null;
  rejectionNumber?: number | null;
  remark?: string | null;
  businessDate?: string | null;
  documentType?: string | null;
  inspectionCategory?: string | null;
  sourceOrderNo?: string | null;
  sourceDocumentType?: string | null;
  records?: CreateUpdateIqcInspectionRecordDto[] | null;
}

export interface CreateUpdateIqcInspectionRecordDto {
  id?: string | null;
  inspectionItemId: string;
  itemCode: string;
  itemName: string;
  standardValue?: string | null;
  usl?: string | null;
  ucl?: string | null;
  lcl?: string | null;
  lsl?: string | null;
  actualValue?: string | null;
  judgment?: ItemJudgment | null;
  defectId?: string | null;
  defectCode?: string | null;
  defectDescription?: string | null;
  defectCount?: number;
  improvementDescription?: string | null;
  remark?: string | null;
  ruleEvaluationResultJson?: string | null;
}

export interface CreateUpdateIqcInspectionSampleDto {
  sampleNo?: number;
  sampleName?: string | null;
  sampleValue?: string | null;
  judgment?: ItemJudgment | null;
  defectId?: string | null;
  defectCode?: string | null;
  defectDescription?: string | null;
  remark?: string | null;
}

export interface GetIqcInspectionOrderListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  status?: InspectionStatus | null;
  result?: InspectionResult | null;
  startDate?: string | null;
  endDate?: string | null;
  documentType?: string | null;
  inspectionPlanCode?: string | null;
}

export interface IqcInspectionOrderDto extends AuditedEntityDto<string> {
  orderNo?: string;
  purchaseOrderNo?: string | null;
  materialId?: string;
  materialCode?: string;
  materialName?: string;
  materialSpec?: string | null;
  supplierId?: string | null;
  supplierName?: string | null;
  supplierCode?: string | null;
  samplingSchemeCode?: string | null;
  lotSize?: number;
  arrivalDate?: string | null;
  batchNo?: string | null;
  qualityInspectionPlanId?: string | null;
  qualityInspectionPlanName?: string | null;
  inspectionPlanCode?: string | null;
  inspectionPlanName?: string | null;
  processId?: string | null;
  processName?: string | null;
  processCode?: string | null;
  organizationId?: string | null;
  organizationCode?: string | null;
  organizationName?: string | null;
  samplingSchemeId?: string | null;
  samplingSchemeName?: string | null;
  inspectionLevel?: InspectionLevel | null;
  aqlValue?: number | null;
  sampleSize?: number | null;
  sampleSizeCode?: string | null;
  acceptanceNumber?: number | null;
  rejectionNumber?: number | null;
  status?: InspectionStatus;
  result?: InspectionResult | null;
  startInspectionTime?: string | null;
  completedInspectionTime?: string | null;
  inspectorId?: string | null;
  inspectorName?: string | null;
  remark?: string | null;
  businessDate?: string | null;
  documentType?: string | null;
  inspectionCategory?: string | null;
  sourceOrderNo?: string | null;
  sourceDocumentType?: string | null;
  qualifiedSampleCount?: number | null;
  unqualifiedSampleCount?: number | null;
  incompleteSampleCount?: number | null;
  unqualifiedItemCount?: number | null;
  qualifiedItemCount?: number | null;
  pendingItemCount?: number | null;
  nonConformingOrderNo?: string | null;
  records?: IqcInspectionRecordDto[] | null;
}

export interface IqcInspectionRecordDto extends CreationAuditedEntityDto<string> {
  orderId?: string;
  inspectionItemId?: string;
  itemCode?: string;
  itemName?: string;
  standardValue?: string | null;
  usl?: string | null;
  ucl?: string | null;
  lcl?: string | null;
  lsl?: string | null;
  actualValue?: string | null;
  judgment?: ItemJudgment | null;
  defectId?: string | null;
  defectCode?: string | null;
  defectDescription?: string | null;
  defectCount?: number;
  improvementDescription?: string | null;
  remark?: string | null;
  inspectionStepIndicatorId?: string | null;
  originalRulesJson?: string | null;
  ruleEvaluationResultJson?: string | null;
  stepCode?: string | null;
  stepName?: string | null;
  samplingSchemeId?: string | null;
  inspectionLevel?: number | null;
  aqlValue?: number | null;
  sortOrder?: number;
  samples?: IqcInspectionSampleDto[] | null;
}

export interface IqcInspectionSampleDto {
  id?: string;
  recordId?: string;
  sampleNo?: number;
  sampleName?: string | null;
  sampleValue?: string | null;
  judgment?: ItemJudgment | null;
  defectId?: string | null;
  defectCode?: string | null;
  defectDescription?: string | null;
  remark?: string | null;
  creationTime?: string | null;
  creatorId?: string | null;
}

export interface GetQualityIndicatorListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  code?: string | null;
  name?: string | null;
}
