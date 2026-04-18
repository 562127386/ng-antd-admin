import type { AttendanceImportConfigDto, CreateUpdateAttendanceImportConfigDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceImportConfigService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateAttendanceImportConfigDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceImportConfigDto>(
      {
        method: 'POST',
        url: '/api/app/attendance-import-config',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/attendance-import-config/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceImportConfigDto>(
      {
        method: 'GET',
        url: `/api/app/attendance-import-config/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AttendanceImportConfigDto>>(
      {
        method: 'GET',
        url: '/api/app/attendance-import-config',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateAttendanceImportConfigDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceImportConfigDto>(
      {
        method: 'PUT',
        url: `/api/app/attendance-import-config/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
