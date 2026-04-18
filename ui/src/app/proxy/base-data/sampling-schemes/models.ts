import type { SamplingSchemeType } from '../../enums/sampling-scheme-type.enum';
import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateSamplingSchemeDto {
  code: string;
  name: string;
  schemeType: SamplingSchemeType;
  description?: string | null;
  isEnabled?: boolean;
  sortOrder?: number;
  aqlConfigId?: string | null;
  fixedSampleSize?: number | null;
  samplePercentage?: number | null;
  acceptanceNumber?: number | null;
  rejectionNumber?: number | null;
}

export interface GetSamplingSchemeListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  isEnabled?: boolean | null;
  schemeType?: SamplingSchemeType | null;
}

export interface SamplingSchemeDto extends AuditedEntityDto<string> {
  code?: string;
  name?: string;
  schemeType?: SamplingSchemeType;
  description?: string | null;
  isEnabled?: boolean;
  sortOrder?: number;
  aqlConfigId?: string | null;
  fixedSampleSize?: number | null;
  samplePercentage?: number | null;
  acceptanceNumber?: number | null;
  rejectionNumber?: number | null;
}
