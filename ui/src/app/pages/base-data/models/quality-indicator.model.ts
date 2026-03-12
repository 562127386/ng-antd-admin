export interface QualityIndicatorDto {
  id: string;
  code: string;
  indicatorCategory: string;
  name: string;
  inspectionType: string;
  defaultValue: string;
  dataType: string;
  unit: string;
  decimalPlaces: number;
  isCritical: boolean;
  isEnabled: boolean;
  remark?: string;
  sortOrder: number;
  creationTime: string;
  creatorId?: string;
  lastModificationTime?: string;
  lastModifierId?: string;
  inspectionRules?: InspectionRuleDto[];
}

export interface CreateUpdateQualityIndicatorDto {
  code: string;
  indicatorCategory: string;
  name: string;
  inspectionType: string;
  defaultValue: string;
  dataType: string;
  unit: string;
  decimalPlaces: number;
  isCritical: boolean;
  isEnabled: boolean;
  remark?: string;
  sortOrder: number;
}

export interface InspectionRuleDto {
  id: string;
  qualityIndicatorId: string;
  name: string;
  severityLevel: string;
  priority: number;
  conditionExpression: string;
  judgmentResult: string;
  description: string;
  executeAction: string;
  remark?: string;
  creationTime: string;
  creatorId?: string;
  lastModificationTime?: string;
  lastModifierId?: string;
}

export interface CreateUpdateInspectionRuleDto {
  name: string;
  severityLevel: string;
  priority: number;
  conditionExpression: string;
  judgmentResult: string;
  description: string;
  executeAction: string;
  remark?: string;
}
