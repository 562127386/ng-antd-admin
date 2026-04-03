export enum QualityInspectionPlanStatus {
  Draft = 1,
  Active = 2,
  Inactive = 3
}

export interface InspectionStepIndicatorRuleDto {
  id: string;
  inspectionStepIndicatorId?: string;
  originalRuleId?: string;
  name: string;
  severityLevel: string;
  priority: number;
  conditionExpression: string;
  judgmentResult: string;
  description: string;
  executeAction: string;
  remark?: string;
}

export interface CreateUpdateInspectionStepIndicatorRuleDto {
  id?: string;
  name: string;
  severityLevel: string;
  priority: number;
  conditionExpression: string;
  judgmentResult: string;
  description: string;
  executeAction: string;
  remark?: string;
}

export interface InspectionItemDto {
  id: string;
  standardId: string;
  code: string;
  name: string;
  inspectionMethod: number;
  standardValue?: number;
  usl?: number;
  ucl?: number;
  lcl?: number;
  lsl?: number;
  tool?: string;
  methodDescription?: string;
  frequency?: string;
  isCritical: boolean;
  defectSeverity?: number;
  defectCode?: string;
  sortOrder: number;
  // 判定规则列表
  rules?: InspectionStepIndicatorRuleDto[];
}

export interface CreateUpdateInspectionItemDto {
  id?: string;
  code: string;
  name: string;
  inspectionMethod: number;
  standardValue?: number;
  usl?: number;
  ucl?: number;
  lcl?: number;
  lsl?: number;
  tool?: string;
  methodDescription?: string;
  frequency?: string;
  isCritical: boolean;
  defectSeverity?: number;
  defectCode?: string;
  sortOrder: number;
  // 判定规则列表
  rules?: CreateUpdateInspectionStepIndicatorRuleDto[];
}

export interface InspectionStepDto {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  isEnabled: boolean;
  remark?: string;
  samplingSchemeName?: string;
  samplingSchemeId?: string;
  inspectionLevel?: number;
  aqlValue?: number;
  items?: InspectionItemDto[];
}

export interface CreateUpdateInspectionStepDto {
  id?: string;
  code: string;
  name: string;
  sortOrder: number;
  isEnabled: boolean;
  remark?: string;
  samplingSchemeName?: string;
  samplingSchemeId?: string;
  inspectionLevel?: number;
  aqlValue?: number;
  items?: CreateUpdateInspectionItemDto[];
  indicatorIds?: string[];
}

export interface QualityInspectionPlanDto {
  id: string;
  code: string;
  name: string;
  version: string;
  effectiveDate: Date;
  expiryDate?: Date;
  inspectionType: number;
  samplingSchemeType: number;
  samplingSchemeConfig?: string;
  samplingSchemeId?: string;
  samplingSchemeName?: string;
  inspectionLevel?: number;
  aqlValue?: number;
  remark?: string;
  status: number;
  steps?: InspectionStepDto[];
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateQualityInspectionPlanDto {
  code: string;
  name: string;
  version: string;
  effectiveDate: Date;
  expiryDate?: Date;
  inspectionType: number;
  samplingSchemeType: number;
  samplingSchemeConfig?: string;
  samplingSchemeId?: string;
  samplingSchemeName?: string;
  inspectionLevel?: number;
  aqlValue?: number;
  remark?: string;
  steps?: CreateUpdateInspectionStepDto[];
  //items?: CreateUpdateInspectionItemDto[];
}

export interface GetQualityInspectionPlanListDto {
  filter?: string;
  status?: number;
  inspectionType?: number;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
}
