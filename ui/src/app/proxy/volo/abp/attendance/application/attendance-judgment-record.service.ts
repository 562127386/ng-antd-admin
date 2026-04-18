import type { AttendanceJudgmentRecordDto, AttendanceJudgmentResultRequestDto, CreateUpdateAttendanceJudgmentRecordDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { FileContentResult } from '../../../../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceJudgmentRecordService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateAttendanceJudgmentRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceJudgmentRecordDto>(
      {
        method: 'POST',
        url: '/api/app/attendance-judgment-record',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/attendance-judgment-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  exportByTemplateByInput = (input: AttendanceJudgmentResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>(
      {
        method: 'POST',
        url: '/api/app/attendance-judgment-record/export-by-template',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  exportByTemplateFileByInput = (input: AttendanceJudgmentResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FileContentResult>(
      {
        method: 'POST',
        url: '/api/app/attendance-judgment-record/export-by-template-file',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceJudgmentRecordDto>(
      {
        method: 'GET',
        url: `/api/app/attendance-judgment-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: AttendanceJudgmentResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AttendanceJudgmentRecordDto>>(
      {
        method: 'GET',
        url: '/api/app/attendance-judgment-record',
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

  update = (id: string, input: CreateUpdateAttendanceJudgmentRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceJudgmentRecordDto>(
      {
        method: 'PUT',
        url: `/api/app/attendance-judgment-record/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
