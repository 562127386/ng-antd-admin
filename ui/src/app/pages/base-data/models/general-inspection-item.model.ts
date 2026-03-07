export interface GeneralInspectionItemDto {
  id: string;
  inspectionContent: string;
  inspectionItemName: string;
  defectItem: string;
  defectStatus: string;
  isCritical: boolean;
  isMajor: boolean;
  isMinor: boolean;
  remark?: string;
  sortOrder: number;
  creationTime: string;
  creatorId?: string;
  lastModificationTime?: string;
  lastModifierId?: string;
}

export interface CreateUpdateGeneralInspectionItemDto {
  inspectionContent: string;
  inspectionItemName: string;
  defectItem: string;
  defectStatus: string;
  isCritical: boolean;
  isMajor: boolean;
  isMinor: boolean;
  remark?: string;
  sortOrder: number;
}
