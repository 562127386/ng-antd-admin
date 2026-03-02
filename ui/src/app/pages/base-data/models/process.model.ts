export interface ProcessDto {
  id: string;
  code: string;
  name: string;
  workshop: string;
  description?: string;
  isEnabled: boolean;
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateProcessDto {
  code: string;
  name: string;
  workshop: string;
  description?: string;
  isEnabled: boolean;
}

export interface GetProcessListDto {
  filter?: string;
  isEnabled?: boolean;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}
