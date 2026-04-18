import type { CreateUpdateOvertimeRecordDto, OvertimeRecordDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OvertimeRecordService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateOvertimeRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OvertimeRecordDto>(
      {
        method: 'POST',
        url: '/api/app/overtime-record',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/overtime-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OvertimeRecordDto>(
      {
        method: 'GET',
        url: `/api/app/overtime-record/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<OvertimeRecordDto>>(
      {
        method: 'GET',
        url: '/api/app/overtime-record',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateOvertimeRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, OvertimeRecordDto>(
      {
        method: 'PUT',
        url: `/api/app/overtime-record/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
