import type { AttendanceRuleDto, CreateUpdateAttendanceRuleDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceRuleService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateAttendanceRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRuleDto>(
      {
        method: 'POST',
        url: '/api/app/attendance-rule',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/attendance-rule/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRuleDto>(
      {
        method: 'GET',
        url: `/api/app/attendance-rule/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AttendanceRuleDto>>(
      {
        method: 'GET',
        url: '/api/app/attendance-rule',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateAttendanceRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceRuleDto>(
      {
        method: 'PUT',
        url: `/api/app/attendance-rule/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
