import type { InspectionType } from '../../enums/inspection-type.enum';
import type { DefectSeverity } from '../../enums/defect-severity.enum';
import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { NonConformingStatus } from '../../enums/non-conforming-status.enum';
import type { ReviewResult } from '../../enums/review-result.enum';
import type { InspectionResult } from '../../enums/inspection-result.enum';

export interface CreateUpdateNonConformingDto {
  orderNo?: string | null;
  sourceModule?: InspectionType;
  relatedOrderNo?: string | null;
  materialCode?: string | null;
  batchNo?: string | null;
  quantity?: number;
  defectiveQuantity?: number;
  description?: string | null;
  defectCode?: string | null;
  severity?: DefectSeverity;
}

export interface GetNonConformingListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  status?: NonConformingStatus | null;
  sourceModule?: InspectionType | null;
}

export interface NonConformingDto extends AuditedEntityDto<string> {
  orderNo?: string;
  sourceModule?: InspectionType;
  relatedOrderNo?: string;
  materialCode?: string;
  batchNo?: string | null;
  quantity?: number;
  defectiveQuantity?: number;
  description?: string;
  defectCode?: string | null;
  severity?: DefectSeverity;
  status?: NonConformingStatus;
  reviewResult?: ReviewResult | null;
  reworkQty?: number | null;
  repairQty?: number | null;
  scrapQty?: number | null;
  responsiblePerson?: string | null;
  responsibleDept?: string | null;
  responsibleSupplier?: string | null;
  completionTime?: string | null;
  reInspectionResult?: InspectionResult | null;
}
