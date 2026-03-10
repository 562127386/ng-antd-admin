export interface GeneralInspectionItemDto {
  id: string;
  code: string;
  indicatorCategory: string;
  inspectionItemName: string;
  inspectionType: string;
  defectItem: string;
  defectStatus: string;
  isCritical: boolean;
  isMajor: boolean;
  isMinor: boolean;
  isEnabled: boolean;
  remark?: string;
  sortOrder: number;
  creationTime: string;
  creatorId?: string;
  lastModificationTime?: string;
  lastModifierId?: string;
}

export interface CreateUpdateGeneralInspectionItemDto {
  code: string;
  indicatorCategory: string;
  inspectionItemName: string;
  inspectionType: string;
  defectItem: string;
  defectStatus: string;
  isCritical: boolean;
  isMajor: boolean;
  isMinor: boolean;
  isEnabled: boolean;
  remark?: string;
  sortOrder: number;
}
