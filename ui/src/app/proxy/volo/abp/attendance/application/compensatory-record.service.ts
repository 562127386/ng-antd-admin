import type { CompensatoryRecordDto, CreateUpdateCompensatoryRecordDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompensatoryRecordService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateCompensatoryRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CompensatoryRecordDto>(
      {
        method: 'POST',
        url: '/api/app/compensatory-record',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/compensatory-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CompensatoryRecordDto>(
      {
        method: 'GET',
        url: `/api/app/compensatory-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CompensatoryRecordDto>>(
      {
        method: 'GET',
        url: '/api/app/compensatory-record',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateCompensatoryRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CompensatoryRecordDto>(
      {
        method: 'PUT',
        url: `/api/app/compensatory-record/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
