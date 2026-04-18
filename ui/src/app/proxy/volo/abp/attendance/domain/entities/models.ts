import type { FullAuditedAggregateRoot } from '../../../domain/entities/auditing/models';

export interface AttendanceJudgmentRecord extends FullAuditedAggregateRoot<string> {
  employeeId: string;
  employeeNo?: string;
  employeeName: string;
  department?: string;
  recordDate?: string;
  ruleName?: string;
  shiftName?: string;
  actualWorkStartTime?: string | null;
  actualWorkEndTime?: string | null;
  lateMinutes?: string | null;
  earlyLeaveMinutes?: string | null;
  attendanceStatus?: string;
  lateLevel?: string;
  earlyLeaveLevel?: string;
  judgmentReason?: string;
  punchRecords?: string;
  isOvertime?: boolean;
  overtimeHours?: number | null;
  isCompensatory?: boolean;
  judgmentTime?: string;
}

export interface AttendanceRecord extends FullAuditedAggregateRoot<string> {
  employeeId: string;
  employeeNo?: string;
  employeeName: string;
  department?: string;
  punchTime?: string;
  status?: string;
  punchLocation?: string;
  customName?: string;
  dataSource?: string;
  processType?: string;
  temperature?: number | null;
  temperatureAbnormal?: boolean | null;
  importTime?: string;
}
