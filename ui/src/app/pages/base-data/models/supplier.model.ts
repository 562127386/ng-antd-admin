export interface SupplierDto {
  id: string;
  code: string;
  name: string;
  contactPerson?: string;
  contactPhone?: string;
  email?: string;
  address?: string;
  isEnabled: boolean;
  sortOrder: number;
  remark?: string;
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateSupplierDto {
  code: string;
  name: string;
  contactPerson?: string;
  contactPhone?: string;
  email?: string;
  address?: string;
  isEnabled: boolean;
  sortOrder: number;
  remark?: string;
}

export interface GetSupplierListDto {
  filter?: string;
  isEnabled?: boolean;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}
