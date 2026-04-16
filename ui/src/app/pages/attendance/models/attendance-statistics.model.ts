export interface AttendanceStatistics {
  id: string;
  employeeId: string;
  employeeName: string;
  year: number;
  month: number;
  normalWorkDays: number;
  actualWorkDays: number;
  absentDays: number;
  lateDays: number;
  earlyLeaveDays: number;
  overtimeHours: number;
  compensatoryHours: number;
  leaveDays: number;
  remark: string;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
