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
  samples?: IqcInspectionSampleDto[];
}

export interface IqcInspectionSampleDto {
  id: string;
  recordId: string;
  sampleNo: number;
  sampleName?: string;
  sampleValue?: string;
  judgment: number;
  defectId?: string;
  defectCode?: string;
  defectDescription?: string;
  remark?: string;
  creationTime?: Date;
  creatorId?: string;
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

export interface BatchSaveRecordsDto {
  orderId: string;
  records: {
    inspectionItemId: string;
    stepCode: string;
    stepName: string;
    itemCode: string;
    itemName: string;
    judgment: number;
    defectDescription?: string;
    improvementDescription?: string;
    remark?: string;
    samples: {
      sampleNo: number;
      sampleName?: string;
      sampleValue?: string;
      judgment: number;
      defectCode?: string;
      defectDescription?: string;
      remark?: string;
    }[];
  }[];
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
  samplingSchemeName?: string;
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
  qualifiedSampleCount?: number;
  unqualifiedSampleCount?: number;
  incompleteSampleCount?: number;
  unqualifiedItemCount?: number;
  qualifiedItemCount?: number;
  pendingItemCount?: number;
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
