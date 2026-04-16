export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  recordDate: string;
  punchInTime: string;
  punchOutTime: string;
  punchInDevice: string;
  punchOutDevice: string;
  punchInLocation: string;
  punchOutLocation: string;
  status: string;
  remark: string;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
