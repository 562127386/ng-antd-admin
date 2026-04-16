export interface CompensatoryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  overtimeDate: string;
  overtimeHours: number;
  compensatoryDate: string;
  compensatoryHours: number;
  status: string;
  approverId: string;
  approverName: string;
  approvalTime: string;
  approvalRemark: string;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
