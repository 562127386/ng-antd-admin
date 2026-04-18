import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { AttendanceRuleDto, CreateUpdateAttendanceRuleDto } from '../../application/contracts/dtos/models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceRulesService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateAttendanceRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRuleDto>(
      {
        method: 'POST',
        url: '/api/attendance/rules',
        params: {
          ruleName: input.ruleName,
          departmentIds: input.departmentIds,
          exemptedPunchUsers: input.exemptedPunchUsers,
          exemptedAttendanceUsers: input.exemptedAttendanceUsers,
          allowPunchYesterday: input.allowPunchYesterday,
          allowPunchTomorrow: input.allowPunchTomorrow,
          enablePublicHolidays: input.enablePublicHolidays,
          shiftName: input.shiftName,
          enableBreakTime: input.enableBreakTime,
          breakStartTime: input.breakStartTime,
          breakEndTime: input.breakEndTime,
          absenteeismMinutes: input.absenteeismMinutes,
          segmentRuleMinutes: input.segmentRuleMinutes,
          lagScheduling: input.lagScheduling,
          workTimes: input.workTimes,
          needPunchOffWork: input.needPunchOffWork,
          workStartTime: input.workStartTime,
          earlyPunchMinutes: input.earlyPunchMinutes,
          workEndTime: input.workEndTime,
          latePunchMinutes: input.latePunchMinutes,
          workDayCount: input.workDayCount,
          minorLateMinutes: input.minorLateMinutes,
          moderateLateMinutes: input.moderateLateMinutes,
          severeLateMinutes: input.severeLateMinutes,
          minorEarlyLeaveMinutes: input.minorEarlyLeaveMinutes,
          moderateEarlyLeaveMinutes: input.moderateEarlyLeaveMinutes,
          severeEarlyLeaveMinutes: input.severeEarlyLeaveMinutes
        }
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/attendance/rules/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRuleDto>(
      {
        method: 'GET',
        url: `/api/attendance/rules/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AttendanceRuleDto>>(
      {
        method: 'GET',
        url: '/api/attendance/rules',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateAttendanceRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRuleDto>(
      {
        method: 'PUT',
        url: `/api/attendance/rules/${id}`,
        params: {
          ruleName: input.ruleName,
          departmentIds: input.departmentIds,
          exemptedPunchUsers: input.exemptedPunchUsers,
          exemptedAttendanceUsers: input.exemptedAttendanceUsers,
          allowPunchYesterday: input.allowPunchYesterday,
          allowPunchTomorrow: input.allowPunchTomorrow,
          enablePublicHolidays: input.enablePublicHolidays,
          shiftName: input.shiftName,
          enableBreakTime: input.enableBreakTime,
          breakStartTime: input.breakStartTime,
          breakEndTime: input.breakEndTime,
          absenteeismMinutes: input.absenteeismMinutes,
          segmentRuleMinutes: input.segmentRuleMinutes,
          lagScheduling: input.lagScheduling,
          workTimes: input.workTimes,
          needPunchOffWork: input.needPunchOffWork,
          workStartTime: input.workStartTime,
          earlyPunchMinutes: input.earlyPunchMinutes,
          workEndTime: input.workEndTime,
          latePunchMinutes: input.latePunchMinutes,
          workDayCount: input.workDayCount,
          minorLateMinutes: input.minorLateMinutes,
          moderateLateMinutes: input.moderateLateMinutes,
          severeLateMinutes: input.severeLateMinutes,
          minorEarlyLeaveMinutes: input.minorEarlyLeaveMinutes,
          moderateEarlyLeaveMinutes: input.moderateEarlyLeaveMinutes,
          severeEarlyLeaveMinutes: input.severeEarlyLeaveMinutes
        }
      },
      { apiName: this.apiName, ...config }
    );
}
