export interface MaterialDto {
  id: string;
  code: string;
  name: string;
  specification?: string;
  drawingNo?: string;
  materialType: number;
  batchManagement: boolean;
  expiryManagement: boolean;
  supplier?: string;
  defaultStandardId?: string;
  isEnabled: boolean;
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateMaterialDto {
  code: string;
  name: string;
  specification?: string;
  drawingNo?: string;
  materialType: number;
  batchManagement: boolean;
  expiryManagement: boolean;
  supplier?: string;
  defaultStandardId?: string;
  isEnabled: boolean;
}

export interface GetMaterialListDto {
  filter?: string;
  isEnabled?: boolean;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}
