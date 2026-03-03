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

export interface InspectionStandardDto {
  id: string;
  code: string;
  version: string;
  effectiveDate: Date;
  expiryDate?: Date;
  inspectionType: number;
  samplingSchemeType: number;
  samplingSchemeConfig?: string;
  status: number;
  items?: InspectionItemDto[];
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateInspectionStandardDto {
  code: string;
  version: string;
  effectiveDate: Date;
  expiryDate?: Date;
  inspectionType: number;
  samplingSchemeType: number;
  samplingSchemeConfig?: string;
  items?: CreateUpdateInspectionItemDto[];
}

export interface GetInspectionStandardListDto {
  filter?: string;
  status?: number;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
}
