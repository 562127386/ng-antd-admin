export interface EmployeeSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  scheduleDate: string;
  shiftCode: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  isWorkDay: boolean;
  isSizeRest: boolean;
  remark: string;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
