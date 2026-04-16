export interface AttendanceJudgmentRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  recordDate: string;
  attendanceStatus: string;
  judgmentReason: string;
  punishmentType: string;
  punishmentAmount: number;
  operatorId: string;
  operatorName: string;
  judgmentTime: string;
  remark: string;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
