import type { InspectionMethod } from '../../enums/inspection-method.enum';
import type { DefectSeverity } from '../../enums/defect-severity.enum';
import type { InspectionType } from '../../enums/inspection-type.enum';
import type { SamplingSchemeType } from '../../enums/sampling-scheme-type.enum';
import type { AuditedEntityDto, EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { InspectionStandardStatus } from '../../enums/inspection-standard-status.enum';

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

export interface CreateUpdateInspectionStandardDto {
  code: string;
  version: string;
  effectiveDate: string;
  expiryDate?: string | null;
  inspectionType: InspectionType;
  samplingSchemeType: SamplingSchemeType;
  samplingSchemeConfig?: string | null;
  items?: CreateUpdateInspectionItemDto[] | null;
}

export interface GetInspectionStandardListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  status?: InspectionStandardStatus | null;
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

export interface InspectionStandardDto extends AuditedEntityDto<string> {
  code?: string;
  version?: string;
  effectiveDate?: string;
  expiryDate?: string | null;
  inspectionType?: InspectionType;
  samplingSchemeType?: SamplingSchemeType;
  samplingSchemeConfig?: string | null;
  status?: InspectionStandardStatus;
  items?: InspectionItemDto[] | null;
}
