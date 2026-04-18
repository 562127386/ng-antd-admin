import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateProcessDto {
  code: string;
  name: string;
  workshop: string;
  productionLine?: string | null;
  requireInspection: boolean;
  requireFirstArticle: boolean;
  isEnabled?: boolean;
}

export interface GetProcessListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  isEnabled?: boolean | null;
}

export interface ProcessDto extends AuditedEntityDto<string> {
  code?: string;
  name?: string;
  workshop?: string;
  productionLine?: string | null;
  requireInspection?: boolean;
  requireFirstArticle?: boolean;
  isEnabled?: boolean;
}
