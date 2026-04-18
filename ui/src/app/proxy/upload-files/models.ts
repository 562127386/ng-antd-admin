import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUploadFileDto {
  tenantId?: string | null;
  entityName: string;
  recordId: string;
  name: string;
  type: string;
  path: string;
}

export interface GetUploadFileListDto extends PagedAndSortedResultRequestDto {
  entityName?: string | null;
  recordId?: string | null;
}

export interface UpdateUploadFileDto {
  entityName: string;
  recordId: string;
  name: string;
  type: string;
  path: string;
}

export interface UploadFileDto extends EntityDto<string> {
  tenantId?: string | null;
  entityName?: string;
  recordId?: string;
  name?: string;
  type?: string;
  path?: string;
  url?: string;
}
