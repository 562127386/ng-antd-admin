import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateSupplierDto {
  code?: string;
  name?: string;
  contactPerson?: string | null;
  contactPhone?: string | null;
  email?: string | null;
  address?: string | null;
  isEnabled?: boolean;
  sortOrder?: number;
  remark?: string | null;
}

export interface GetSupplierListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  isEnabled?: boolean | null;
}

export interface SupplierDto extends AuditedEntityDto<string> {
  code?: string;
  name?: string;
  contactPerson?: string | null;
  contactPhone?: string | null;
  email?: string | null;
  address?: string | null;
  isEnabled?: boolean;
  sortOrder?: number;
  remark?: string | null;
}
