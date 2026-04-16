export interface AttendanceRule {
  id: string;
  ruleName: string;
  description: string;
  shiftStartTime: string;
  shiftEndTime: string;
  breakStartTime: string;
  breakEndTime: string;
  lateThreshold: number;
  earlyLeaveThreshold: number;
  absentThreshold: number;
  isEnabled: boolean;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
