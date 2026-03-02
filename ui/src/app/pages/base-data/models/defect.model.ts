export interface DefectDto {
  id: string;
  code: string;
  name: string;
  category: number;
  severity: number;
  module: number;
  remark?: string;
  isEnabled: boolean;
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateDefectDto {
  code: string;
  name: string;
  category: number;
  severity: number;
  module: number;
  remark?: string;
  isEnabled: boolean;
}

export interface GetDefectListDto {
  filter?: string;
  category?: number;
  severity?: number;
  module?: number;
  isEnabled?: boolean;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}
