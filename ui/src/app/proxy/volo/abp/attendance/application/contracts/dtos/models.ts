import type { FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface AttendanceJudgmentResultRequestDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  department?: string | null;
  attendanceStatus?: string | null;
}

export interface AttendanceImportConfigDto extends FullAuditedEntityDto<string> {
  configName?: string;
  fileType?: string;
  headerMapping?: string;
  validationRules?: string;
  defaultValues?: string;
  isActive?: boolean;
  description?: string;
}

export interface AttendanceJudgmentRecordDto extends FullAuditedEntityDto<string> {
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

export interface AttendanceRecordDto extends FullAuditedEntityDto<string> {
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

export interface AttendanceRuleDto extends FullAuditedEntityDto<string> {
  ruleName?: string;
  departmentIds?: string;
  exemptedPunchUsers?: string;
  exemptedAttendanceUsers?: string;
  allowPunchYesterday?: boolean;
  allowPunchTomorrow?: boolean;
  enablePublicHolidays?: boolean;
  shiftName?: string;
  enableBreakTime?: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  absenteeismMinutes?: number;
  segmentRuleMinutes?: number;
  lagScheduling?: boolean;
  workTimes?: number;
  needPunchOffWork?: boolean;
  workStartTime?: string;
  earlyPunchMinutes?: number;
  workEndTime?: string;
  latePunchMinutes?: number;
  workDayCount?: number;
  minorLateMinutes?: number;
  moderateLateMinutes?: number;
  severeLateMinutes?: number;
  minorEarlyLeaveMinutes?: number;
  moderateEarlyLeaveMinutes?: number;
  severeEarlyLeaveMinutes?: number;
}

export interface AttendanceStatisticsDto extends FullAuditedEntityDto<string> {
  employeeId: string;
  employeeNo?: string;
  employeeName: string;
  department?: string;
  year?: number;
  month?: number;
  workDays?: number;
  recordDays?: number;
  lateCount?: number;
  absenteeismCount?: number;
  earlyLeaveCount?: number;
  minorLateCount?: number;
  moderateLateCount?: number;
  severeLateCount?: number;
  minorEarlyLeaveCount?: number;
  moderateEarlyLeaveCount?: number;
  severeEarlyLeaveCount?: number;
  leaveDays?: number;
  holidayDays?: number;
  compensatoryDays?: number;
  overtimeHours?: number;
  statisticsTime?: string;
}

export interface AttendanceStatisticsRequestDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  department?: string | null;
  attendanceStatus?: string | null;
}

export interface CompensatoryRecordDto extends FullAuditedEntityDto<string> {
  employeeId?: string;
  employeeNo?: string;
  employeeName?: string;
  overtimeDate?: string;
  overtimeHours?: number;
  compensatoryDate?: string;
  compensatoryHours?: number;
  status?: string;
  approverId?: string;
  approverName?: string;
  approvalTime?: string | null;
  approvalRemark?: string;
}

export interface CreateUpdateAttendanceImportConfigDto {
  configName: string;
  fileType: string;
  headerMapping?: string;
  validationRules?: string;
  defaultValues?: string;
  isActive?: boolean;
  description?: string;
}

export interface CreateUpdateAttendanceJudgmentRecordDto {
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

export interface CreateUpdateAttendanceRecordDto {
  employeeId: string;
  employeeNo?: string;
  employeeName?: string;
  recordDate: string;
  punchInTime?: string | null;
  punchOutTime?: string | null;
  punchInDevice?: string;
  punchOutDevice?: string;
  punchInLocation?: string;
  punchOutLocation?: string;
  status?: string;
  remark?: string;
}

export interface CreateUpdateAttendanceRuleDto {
  ruleName: string;
  departmentIds?: string;
  exemptedPunchUsers?: string;
  exemptedAttendanceUsers?: string;
  allowPunchYesterday?: boolean;
  allowPunchTomorrow?: boolean;
  enablePublicHolidays?: boolean;
  shiftName?: string;
  enableBreakTime?: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  absenteeismMinutes?: number;
  segmentRuleMinutes?: number;
  lagScheduling?: boolean;
  workTimes?: number;
  needPunchOffWork?: boolean;
  workStartTime?: string;
  earlyPunchMinutes?: number;
  workEndTime?: string;
  latePunchMinutes?: number;
  workDayCount?: number;
  minorLateMinutes?: number;
  moderateLateMinutes?: number;
  severeLateMinutes?: number;
  minorEarlyLeaveMinutes?: number;
  moderateEarlyLeaveMinutes?: number;
  severeEarlyLeaveMinutes?: number;
}

export interface CreateUpdateAttendanceStatisticsDto {
  employeeId: string;
  employeeNo?: string;
  employeeName: string;
  department?: string;
  year?: number;
  month?: number;
  workDays?: number;
  recordDays?: number;
  lateCount?: number;
  absenteeismCount?: number;
  earlyLeaveCount?: number;
  minorLateCount?: number;
  moderateLateCount?: number;
  severeLateCount?: number;
  minorEarlyLeaveCount?: number;
  moderateEarlyLeaveCount?: number;
  severeEarlyLeaveCount?: number;
  leaveDays?: number;
  holidayDays?: number;
  compensatoryDays?: number;
  overtimeHours?: number;
  statisticsTime?: string;
}

export interface CreateUpdateCompensatoryRecordDto {
  employeeId: string;
  employeeNo?: string;
  employeeName?: string;
  overtimeDate: string;
  overtimeHours: number;
  compensatoryDate: string;
  compensatoryHours: number;
  status?: string;
  approverId?: string;
  approverName?: string;
  approvalTime?: string | null;
  approvalRemark?: string;
}

export interface CreateUpdateEmployeeScheduleDto {
  employeeId: string;
  employeeNo?: string;
  employeeName?: string;
  scheduleDate: string;
  shiftCode: string;
  shiftName?: string;
  startTime?: string;
  endTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  isWorkDay?: boolean;
  isSizeRest?: boolean;
  remark?: string;
}

export interface CreateUpdateLeaveRecordDto {
  employeeId: string;
  employeeNo?: string;
  employeeName?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  reason?: string;
  status?: string;
  approverId?: string;
  approverName?: string;
  approvalTime?: string | null;
  approvalRemark?: string;
}

export interface CreateUpdateOvertimeRecordDto {
  employeeId: string;
  employeeNo?: string;
  employeeName?: string;
  overtimeDate: string;
  startTime: string;
  endTime: string;
  overtimeHours: number;
  overtimeType: string;
  reason?: string;
  status?: string;
  approverId?: string;
  approverName?: string;
  approvalTime?: string | null;
  approvalRemark?: string;
}

export interface CreateUpdatePublicHolidayDto {
  holidayName: string;
  holidayDate: string;
  description?: string;
  isHalfDay?: boolean;
  startTime?: string | null;
  endTime?: string | null;
}

export interface CreateUpdateSchedulingRuleDto {
  ruleName: string;
  description?: string;
  isSizeRest?: boolean;
  cycleDays?: number;
  workDayPattern?: string;
  departmentIds?: string;
  employeeIds?: string;
  effectiveStartDate?: string;
  effectiveEndDate?: string | null;
  attendanceGroupName?: string;
  participantDepartments?: string;
  noPunchEmployees?: string;
  noAttendanceEmployees?: string;
  enablePublicHolidays?: boolean;
  workShiftCount?: string;
  isPunchOffWork?: boolean;
  workStartTime?: string;
  earlyPunchMinutes?: number;
  workEndTime?: string;
  latePunchEndMinutes?: number;
  attendanceDayCount?: number;
  enableRestTime?: boolean;
  restStartTime?: string | null;
  restEndTime?: string | null;
  lateMinutesForAbsenteeism?: number;
  earlyLeaveMinutesForAbsenteeism?: number;
  minorLateMinutes?: number | null;
  moderateLateMinutes?: number | null;
  seriousLateMinutes?: number | null;
  minorEarlyLeaveMinutes?: number | null;
  moderateEarlyLeaveMinutes?: number | null;
  seriousEarlyLeaveMinutes?: number | null;
  schedulingCategory?: string;
  schedulingRuleDetail?: string;
}

export interface EmployeeScheduleDto extends FullAuditedEntityDto<string> {
  employeeId?: string;
  employeeNo?: string;
  employeeName?: string;
  scheduleDate?: string;
  shiftCode?: string;
  shiftName?: string;
  startTime?: string;
  endTime?: string;
  breakStartTime?: string;
  breakEndTime?: string;
  isWorkDay?: boolean;
  isSizeRest?: boolean;
  remark?: string;
}

export interface FailedImportRecord {
  rowNumber?: number;
  errorMessage?: string;
  data?: Record<string, object>;
}

export interface ImportAttendanceRequestDto {
  configId?: string | null;
  headerMappings?: string;
  filterRules?: string;
}

export interface ImportAttendanceResultDto {
  success?: boolean;
  successCount?: number;
  failedCount?: number;
  errorMessage?: string;
  failedRecords?: FailedImportRecord[];
}

export interface LeaveRecordDto extends FullAuditedEntityDto<string> {
  employeeId?: string;
  employeeNo?: string;
  employeeName?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  leaveDays?: number;
  reason?: string;
  status?: string;
  approverId?: string;
  approverName?: string;
  approvalTime?: string | null;
  approvalRemark?: string;
}

export interface OvertimeRecordDto extends FullAuditedEntityDto<string> {
  employeeId?: string;
  employeeNo?: string;
  employeeName?: string;
  overtimeDate?: string;
  startTime?: string;
  endTime?: string;
  overtimeHours?: number;
  overtimeType?: string;
  reason?: string;
  status?: string;
  approverId?: string;
  approverName?: string;
  approvalTime?: string | null;
  approvalRemark?: string;
}

export interface PublicHolidayDto extends FullAuditedEntityDto<string> {
  holidayName?: string;
  holidayDate?: string;
  description?: string;
  isHalfDay?: boolean;
  startTime?: string | null;
  endTime?: string | null;
}

export interface SchedulingRuleDto extends FullAuditedEntityDto<string> {
  ruleName: string;
  description?: string;
  isSizeRest?: boolean;
  cycleDays?: number;
  workDayPattern?: string;
  departmentIds?: string;
  employeeIds?: string;
  effectiveStartDate?: string;
  effectiveEndDate?: string | null;
  attendanceGroupName?: string;
  participantDepartments?: string;
  noPunchEmployees?: string;
  noAttendanceEmployees?: string;
  enablePublicHolidays?: boolean;
  workShiftCount?: string;
  isPunchOffWork?: boolean;
  workStartTime?: string;
  earlyPunchMinutes?: number;
  workEndTime?: string;
  latePunchEndMinutes?: number;
  attendanceDayCount?: number;
  enableRestTime?: boolean;
  restStartTime?: string | null;
  restEndTime?: string | null;
  lateMinutesForAbsenteeism?: number;
  earlyLeaveMinutesForAbsenteeism?: number;
  minorLateMinutes?: number | null;
  moderateLateMinutes?: number | null;
  seriousLateMinutes?: number | null;
  minorEarlyLeaveMinutes?: number | null;
  moderateEarlyLeaveMinutes?: number | null;
  seriousEarlyLeaveMinutes?: number | null;
  schedulingCategory?: string;
  schedulingRuleDetail?: string;
}

export interface StatisticsRequestDto {
  employeeId?: string;
  year?: number;
  month?: number;
}
