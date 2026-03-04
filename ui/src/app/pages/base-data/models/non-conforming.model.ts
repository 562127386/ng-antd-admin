export interface NonConformingDto {
  id: string;
  orderNo: string;
  sourceModule: number;
  relatedOrderNo: string;
  materialCode: string;
  batchNo?: string;
  quantity: number;
  defectiveQuantity: number;
  description: string;
  defectCode?: string;
  severity: number;
  status: number;
  reviewResult?: number;
  reworkQty?: number;
  repairQty?: number;
  scrapQty?: number;
  responsiblePerson?: string;
  responsibleDept?: string;
  responsibleSupplier?: string;
  completionTime?: Date;
  reInspectionResult?: number;
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
}

export interface CreateUpdateNonConformingDto {
  orderNo?: string;
  sourceModule: number;
  relatedOrderNo: string;
  materialCode: string;
  batchNo?: string;
  quantity: number;
  defectiveQuantity: number;
  description: string;
  defectCode?: string;
  severity: number;
}

export interface GetNonConformingListDto {
  filter?: string;
  status?: number;
  sourceModule?: number;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface CompleteReviewInput {
  reviewResult: number;
  reworkQty?: number;
  repairQty?: number;
  scrapQty?: number;
  responsiblePerson?: string;
  responsibleDept?: string;
  responsibleSupplier?: string;
}

export interface CompleteDisposalInput {
  reInspectionResult?: number;
}
