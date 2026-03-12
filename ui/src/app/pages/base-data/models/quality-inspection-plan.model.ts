export enum QualityInspectionPlanStatus {
  Draft = 1,
  Active = 2,
  Inactive = 3
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
}

export interface InspectionStepDto {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  isEnabled: boolean;
  remark?: string;
  items?: InspectionItemDto[];
}

export interface CreateUpdateInspectionStepDto {
  id?: string;
  code: string;
  name: string;
  sortOrder: number;
  isEnabled: boolean;
  remark?: string;
  items?: CreateUpdateInspectionItemDto[];
  indicatorIds?: string[];
}

export interface QualityInspectionPlanDto {
  id: string;
  code: string;
  version: string;
  effectiveDate: Date;
  expiryDate?: Date;
  inspectionType: number;
  samplingSchemeType: number;
  samplingSchemeConfig?: string;
  status: number;
  steps?: InspectionStepDto[];
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateQualityInspectionPlanDto {
  code: string;
  version: string;
  effectiveDate: Date;
  expiryDate?: Date;
  inspectionType: number;
  samplingSchemeType: number;
  samplingSchemeConfig?: string;
  steps?: CreateUpdateInspectionStepDto[];
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
