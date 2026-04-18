import type { InspectionLevel } from '../../enums/inspection-level.enum';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface AqlConfigDto {
  id?: string;
  samplingSchemeId?: string | null;
  code: string;
  aqlValue: number;
  inspectionLevel: InspectionLevel;
  minLotSize: number;
  maxLotSize: number;
  sampleSizeCode: string;
  sampleSize: number;
  acceptanceNumber: number;
  rejectionNumber: number;
  remark?: string | null;
  isEnabled?: boolean;
  creationTime?: string;
  creatorId?: string | null;
  lastModificationTime?: string | null;
  lastModifierId?: string | null;
}

export interface CreateUpdateAqlConfigDto {
  samplingSchemeId?: string | null;
  code: string;
  aqlValue: number;
  inspectionLevel: InspectionLevel;
  minLotSize: number;
  maxLotSize: number;
  sampleSizeCode: string;
  sampleSize: number;
  acceptanceNumber: number;
  rejectionNumber: number;
  remark?: string | null;
  isEnabled?: boolean;
}

export interface GetAqlConfigListDto extends PagedAndSortedResultRequestDto {
  samplingSchemeId?: string | null;
  filter?: string | null;
  aqlValue?: number | null;
  inspectionLevel?: InspectionLevel | null;
  isEnabled?: boolean | null;
  minSampleSize?: number | null;
  maxSampleSize?: number | null;
  lotSize?: number | null;
}
