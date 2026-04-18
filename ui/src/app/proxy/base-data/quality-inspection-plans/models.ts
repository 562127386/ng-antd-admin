import type { InspectionMethod } from '../../enums/inspection-method.enum';
import type { DefectSeverity } from '../../enums/defect-severity.enum';
import type { InspectionType } from '../../enums/inspection-type.enum';
import type { SamplingSchemeType } from '../../enums/sampling-scheme-type.enum';
import type { InspectionLevel } from '../../enums/inspection-level.enum';
import type { AuditedEntityDto, EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { QualityInspectionPlanStatus } from '../../enums/quality-inspection-plan-status.enum';

export interface CreateUpdateInspectionItemDto {
  id?: string | null;
  code: string;
  name: string;
  inspectionMethod: InspectionMethod;
  standardValue?: string | null;
  usl?: number | null;
  ucl?: number | null;
  lcl?: number | null;
  lsl?: number | null;
  tool?: string | null;
  methodDescription?: string | null;
  frequency?: string | null;
  isCritical: boolean;
  defectSeverity?: DefectSeverity | null;
  defectCode?: string | null;
  sortOrder: number;
}

export interface CreateUpdateInspectionStepDto {
  id?: string | null;
  code?: string;
  name?: string;
  sortOrder?: number;
  isEnabled?: boolean;
  remark?: string;
  samplingSchemeName?: string;
  samplingSchemeId?: string | null;
  inspectionLevel?: number | null;
  aqlValue?: number | null;
  items?: CreateUpdateInspectionStepItemDto[];
}

export interface CreateUpdateInspectionStepItemDto {
  id?: string | null;
  indicatorId?: string | null;
  code?: string;
  name?: string;
  indicatorCategory?: string;
  inspectionType?: string;
  dataType?: string;
  unit?: string;
  decimalPlaces?: number;
  isCritical?: boolean;
  isEnabled?: boolean;
  remark?: string;
  sortOrder?: number;
  defaultValue?: string;
  inspectionMethod?: number;
  standardValue?: string | null;
  usl?: number | null;
  ucl?: number | null;
  lsl?: number | null;
  lcl?: number | null;
  tool?: string;
  methodDescription?: string;
  frequency?: string;
  defectSeverity?: number | null;
  defectCode?: string;
  rules?: CreateUpdateInspectionStepItemRuleDto[];
}

export interface CreateUpdateInspectionStepItemRuleDto {
  id?: string | null;
  originalRuleId?: string | null;
  name?: string;
  severityLevel?: string;
  priority?: number;
  conditionExpression?: string;
  judgmentResult?: string;
  description?: string;
  executeAction?: string;
  remark?: string;
}

export interface CreateUpdateQualityInspectionPlanDto {
  code: string;
  name: string;
  version: string;
  effectiveDate: string;
  expiryDate?: string | null;
  inspectionType: InspectionType;
  samplingSchemeType: SamplingSchemeType;
  samplingSchemeConfig?: string | null;
  samplingSchemeId?: string | null;
  samplingSchemeName?: string | null;
  inspectionLevel?: InspectionLevel | null;
  aqlValue?: number | null;
  remark?: string | null;
  items?: CreateUpdateInspectionItemDto[] | null;
  steps?: CreateUpdateInspectionStepDto[] | null;
}

export interface GetQualityInspectionPlanListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  status?: QualityInspectionPlanStatus | null;
  inspectionType?: InspectionType | null;
}

export interface InspectionItemDto extends EntityDto<string> {
  standardId?: string;
  code?: string;
  name?: string;
  inspectionMethod?: InspectionMethod;
  standardValue?: string | null;
  usl?: number | null;
  ucl?: number | null;
  lcl?: number | null;
  lsl?: number | null;
  tool?: string | null;
  methodDescription?: string | null;
  frequency?: string | null;
  isCritical?: boolean;
  defectSeverity?: DefectSeverity | null;
  defectCode?: string | null;
  sortOrder?: number;
}

export interface InspectionStepDto {
  id?: string;
  code?: string;
  name?: string;
  sortOrder?: number;
  isEnabled?: boolean;
  remark?: string;
  samplingSchemeName?: string;
  samplingSchemeId?: string | null;
  inspectionLevel?: number | null;
  aqlValue?: number | null;
  indicators?: InspectionStepIndicatorDto[];
}

export interface InspectionStepIndicatorDto {
  id?: string;
  inspectionStepId?: string;
  indicatorId?: string | null;
  code?: string;
  indicatorCategory?: string;
  name?: string;
  inspectionType?: string;
  defaultValue?: string;
  dataType?: string;
  unit?: string;
  decimalPlaces?: number;
  isCritical?: boolean;
  remark?: string;
  isEnabled?: boolean;
  sortOrder?: number;
  rules?: InspectionStepItemRuleDto[];
}

export interface InspectionStepItemRuleDto {
  id?: string;
  originalRuleId?: string | null;
  name?: string;
  severityLevel?: string;
  priority?: number;
  conditionExpression?: string;
  judgmentResult?: string;
  description?: string;
  executeAction?: string;
  remark?: string;
}

export interface QualityInspectionPlanDto extends AuditedEntityDto<string> {
  code?: string;
  name?: string;
  version?: string;
  effectiveDate?: string;
  expiryDate?: string | null;
  inspectionType?: InspectionType;
  samplingSchemeType?: SamplingSchemeType;
  samplingSchemeConfig?: string | null;
  samplingSchemeId?: string | null;
  samplingSchemeName?: string | null;
  inspectionLevel?: InspectionLevel | null;
  aqlValue?: number | null;
  remark?: string | null;
  status?: QualityInspectionPlanStatus;
  items?: InspectionItemDto[] | null;
  steps?: InspectionStepDto[] | null;
}
