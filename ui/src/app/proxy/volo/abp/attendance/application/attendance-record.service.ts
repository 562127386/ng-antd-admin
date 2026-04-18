import type { AttendanceRecordDto, CreateUpdateAttendanceRecordDto, ImportAttendanceRequestDto, ImportAttendanceResultDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { AttendanceRecord } from '../domain/entities/models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceRecordService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateAttendanceRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRecordDto>(
      {
        method: 'POST',
        url: '/api/app/attendance-record',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/attendance-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRecordDto>(
      {
        method: 'GET',
        url: `/api/app/attendance-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AttendanceRecordDto>>(
      {
        method: 'GET',
        url: '/api/app/attendance-record',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  importAttendanceByFileBytesAndRequest = (fileBytes: number[], request: ImportAttendanceRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportAttendanceResultDto>(
      {
        method: 'POST',
        url: '/api/app/attendance-record/import-attendance',
        body: request
      },
      { apiName: this.apiName, ...config }
    );

  importCsvAttendanceByAttendanceRecords = (attendanceRecords: AttendanceRecord[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportAttendanceResultDto>(
      {
        method: 'POST',
        url: '/api/app/attendance-record/import-csv-attendance',
        body: attendanceRecords
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateAttendanceRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRecordDto>(
      {
        method: 'PUT',
        url: `/api/app/attendance-record/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
