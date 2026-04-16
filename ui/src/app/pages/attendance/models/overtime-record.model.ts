export interface OvertimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  overtimeDate: string;
  startTime: string;
  endTime: string;
  overtimeHours: number;
  overtimeType: string;
  reason: string;
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
