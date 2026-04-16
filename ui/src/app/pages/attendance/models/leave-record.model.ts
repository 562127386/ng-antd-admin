export interface LeaveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
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
