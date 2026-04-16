export interface AttendanceImportConfig {
  id: string;
  configName: string;
  fileType: string;
  headerMapping: string;
  validationRules: string;
  defaultValues: string;
  isActive: boolean;
  description: string;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
