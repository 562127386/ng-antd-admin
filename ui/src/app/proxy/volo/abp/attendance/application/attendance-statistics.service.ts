import type { AttendanceStatisticsDto, AttendanceStatisticsRequestDto, CreateUpdateAttendanceStatisticsDto, StatisticsRequestDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { AttendanceJudgmentRecord } from '../domain/entities/models';
import type { FileContentResult } from '../../../../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceStatisticsService {
  private restService = inject(RestService);
  apiName = 'Default';

  batchStatisticsAttendanceByYearAndMonth = (year: number, month: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>(
      {
        method: 'POST',
        url: '/api/app/attendance-statistics/batch-statistics-attendance',
        params: { year, month }
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateUpdateAttendanceStatisticsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceStatisticsDto>(
      {
        method: 'POST',
        url: '/api/app/attendance-statistics',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/attendance-statistics/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  exportByTemplateByInput = (input: AttendanceStatisticsRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>(
      {
        method: 'POST',
        url: '/api/app/attendance-statistics/export-by-template',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  exportByTemplateFileByInput = (input: AttendanceStatisticsRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FileContentResult>(
      {
        method: 'POST',
        url: '/api/app/attendance-statistics/export-by-template-file',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceStatisticsDto>(
      {
        method: 'GET',
        url: `/api/app/attendance-statistics/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: AttendanceStatisticsRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AttendanceStatisticsDto>>(
      {
        method: 'GET',
        url: '/api/app/attendance-statistics',
        params: {
          filter: input.filter,
          department: input.department,
          attendanceStatus: input.attendanceStatus,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount
        }
      },
      { apiName: this.apiName, ...config }
    );

  statisticsAttendanceByRequestAndAttendanceJudgmentRecords = (request: StatisticsRequestDto, attendanceJudgmentRecords?: AttendanceJudgmentRecord[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceStatisticsDto>(
      {
        method: 'POST',
        url: '/api/app/attendance-statistics/statistics-attendance',
        body: attendanceJudgmentRecords
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateAttendanceStatisticsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceStatisticsDto>(
      {
        method: 'PUT',
        url: `/api/app/attendance-statistics/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
