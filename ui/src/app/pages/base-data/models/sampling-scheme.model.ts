export interface SamplingSchemeDto {
  id: string;
  code: string;
  name: string;
  schemeType: number;
  description?: string;
  isEnabled: boolean;
  sortOrder: number;
  aqlConfigId?: string;
  fixedSampleSize?: number;
  samplePercentage?: number;
  acceptanceNumber?: number;
  rejectionNumber?: number;
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateSamplingSchemeDto {
  code: string;
  name: string;
  schemeType: number;
  description?: string;
  isEnabled: boolean;
  sortOrder: number;
  aqlConfigId?: string;
  fixedSampleSize?: number;
  samplePercentage?: number;
  acceptanceNumber?: number;
  rejectionNumber?: number;
}

export interface GetSamplingSchemeListDto {
  filter?: string;
  isEnabled?: boolean;
  schemeType?: number;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}
