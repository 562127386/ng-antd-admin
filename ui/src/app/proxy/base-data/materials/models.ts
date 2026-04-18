import type { MaterialType } from '../../enums/material-type.enum';
import type { AuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateMaterialDto {
  code: string;
  name: string;
  specification?: string | null;
  drawingNo?: string | null;
  materialType: MaterialType;
  batchManagement: boolean;
  expiryManagement: boolean;
  supplier?: string | null;
  defaultStandardId?: string | null;
  isEnabled?: boolean;
}

export interface GetMaterialListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  isEnabled?: boolean | null;
}

export interface MaterialDto extends AuditedEntityDto<string> {
  code?: string;
  name?: string;
  specification?: string | null;
  drawingNo?: string | null;
  materialType?: MaterialType;
  batchManagement?: boolean;
  expiryManagement?: boolean;
  supplier?: string | null;
  defaultStandardId?: string | null;
  isEnabled?: boolean;
}
