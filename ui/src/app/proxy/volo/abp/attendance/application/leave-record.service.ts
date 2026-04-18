import type { CreateUpdateLeaveRecordDto, LeaveRecordDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveRecordService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateLeaveRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LeaveRecordDto>(
      {
        method: 'POST',
        url: '/api/app/leave-record',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/leave-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LeaveRecordDto>(
      {
        method: 'GET',
        url: `/api/app/leave-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LeaveRecordDto>>(
      {
        method: 'GET',
        url: '/api/app/leave-record',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateLeaveRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LeaveRecordDto>(
      {
        method: 'PUT',
        url: `/api/app/leave-record/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
