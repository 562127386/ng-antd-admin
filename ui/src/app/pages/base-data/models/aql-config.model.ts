export interface AqlConfigDto {
  id: string;
  code: string;
  aqlValue: number;
  inspectionLevel: number;
  minLotSize: number;
  maxLotSize: number;
  sampleSizeCode: string;
  sampleSize: number;
  acceptanceNumber: number;
  rejectionNumber: number;
  remark?: string;
  isEnabled: boolean;
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateAqlConfigDto {
  code: string;
  aqlValue: number;
  inspectionLevel: number;
  minLotSize: number;
  maxLotSize: number;
  sampleSizeCode: string;
  sampleSize: number;
  acceptanceNumber: number;
  rejectionNumber: number;
  remark?: string;
  isEnabled: boolean;
}

export interface GetAqlConfigListDto {
  filter?: string;
  aqlValue?: number;
  inspectionLevel?: number;
  isEnabled?: boolean;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}
