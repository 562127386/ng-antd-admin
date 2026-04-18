import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateMenuDto {
  id?: string | null;
  menuName: string;
  parentId?: string | null;
  path?: string | null;
  component?: string | null;
  icon?: string | null;
  orderNum?: number;
  isDisabled?: boolean;
  isExternal?: boolean;
  externalUrl?: string | null;
  permission?: string | null;
  menuType: string;
}

export interface GetMenuListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
}

export interface MenuDto {
  id?: string;
  menuName?: string;
  parentId?: string | null;
  path?: string | null;
  component?: string | null;
  icon?: string | null;
  orderNum?: number;
  isDisabled?: boolean;
  isExternal?: boolean;
  externalUrl?: string | null;
  permission?: string | null;
  menuType?: string;
  creationTime?: string;
  lastModificationTime?: string | null;
  children?: MenuDto[];
}
