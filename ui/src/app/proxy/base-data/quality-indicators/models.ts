import type { FullAuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateInspectionRuleDto {
  name?: string;
  severityLevel?: string;
  priority?: number;
  conditionExpression?: string;
  judgmentResult?: string;
  description?: string;
  executeAction?: string;
  remark?: string | null;
}

export interface CreateUpdateQualityIndicatorDto {
  id?: string | null;
  code: string;
  indicatorCategory: string;
  name: string;
  inspectionType: string;
  defaultValue?: string | null;
  dataType?: string;
  unit?: string | null;
  decimalPlaces?: number | null;
  isCritical?: boolean | null;
  remark?: string | null;
  isEnabled?: boolean;
  sortOrder?: number;
}

export interface InspectionRuleDto extends FullAuditedEntityDto<string> {
  qualityIndicatorId?: string;
  name?: string;
  severityLevel?: string;
  priority?: number;
  conditionExpression?: string;
  judgmentResult?: string;
  description?: string;
  executeAction?: string;
  remark?: string | null;
}

export interface QualityIndicatorDto extends FullAuditedEntityDto<string> {
  code?: string;
  indicatorCategory?: string;
  name?: string;
  inspectionType?: string;
  defaultValue?: string;
  dataType?: string;
  unit?: string;
  decimalPlaces?: number;
  isCritical?: boolean;
  remark?: string | null;
  isEnabled?: boolean;
  sortOrder?: number;
  inspectionRules?: InspectionRuleDto[];
}
