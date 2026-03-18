export interface IqcInspectionRecordDto {
  id: string;
  orderId: string;
  inspectionItemId: string;
  itemCode: string;
  itemName: string;
  standardValue?: string;
  usl?: string;
  ucl?: string;
  lcl?: string;
  lsl?: string;
  actualValue?: string;
  judgment: number;
  defectId?: string;
  defectCode?: string;
  defectDescription?: string;
  defectCount: number;
  improvementDescription?: string;
  remark?: string;
  creationTime: Date;
  creatorId?: string;
  inspectionStepIndicatorId?: string;
  originalRulesJson?: string;
  ruleEvaluationResultJson?: string;
  stepCode?: string;
  stepName?: string;
  sortOrder: number;
}

export interface CreateUpdateIqcInspectionRecordDto {
  id?: string;
  inspectionItemId: string;
  itemCode: string;
  itemName: string;
  standardValue?: string;
  usl?: string;
  ucl?: string;
  lcl?: string;
  lsl?: string;
  actualValue?: string;
  judgment: number;
  defectId?: string;
  defectCode?: string;
  defectDescription?: string;
  defectCount: number;
  improvementDescription?: string;
  remark?: string;
}

export interface IqcInspectionOrderDto {
  id: string;
  orderNo: string;
  purchaseOrderNo?: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialSpec?: string;
  supplierId?: string;
  supplierName?: string;
  lotSize: number;
  arrivalDate?: Date;
  batchNo?: string;
  qualityInspectionPlanId?: string;
  qualityInspectionPlanName?: string;
  samplingSchemeId?: string;
  inspectionLevel?: number;
  aqlValue?: number;
  sampleSize?: number;
  sampleSizeCode?: string;
  acceptanceNumber?: number;
  rejectionNumber?: number;
  status: number;
  result?: number;
  inspectionDate?: Date;
  inspectorId?: string;
  inspectorName?: string;
  remark?: string;
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: Date;
  lastModifierId?: string;
  records?: IqcInspectionRecordDto[];
}

export interface CreateUpdateIqcInspectionOrderDto {
  purchaseOrderNo?: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialSpec?: string;
  supplierId?: string;
  supplierName?: string;
  lotSize: number;
  arrivalDate?: Date;
  batchNo?: string;
  qualityInspectionPlanId?: string;
  samplingSchemeId?: string;
  inspectionLevel?: number;
  aqlValue?: number;
  sampleSize?: number;
  sampleSizeCode?: string;
  acceptanceNumber?: number;
  rejectionNumber?: number;
  remark?: string;
  records?: CreateUpdateIqcInspectionRecordDto[];
}

export interface GetIqcInspectionOrderListDto {
  filter?: string;
  status?: number;
  result?: number;
  startDate?: Date;
  endDate?: Date;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}
