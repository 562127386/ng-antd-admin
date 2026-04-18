import type { CreateUpdateProcessDto, GetProcessListDto, ProcessDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateProcessDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProcessDto>(
      {
        method: 'POST',
        url: '/api/app/process',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/process/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProcessDto>(
      {
        method: 'GET',
        url: `/api/app/process/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetProcessListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProcessDto>>(
      {
        method: 'GET',
        url: '/api/app/process',
        params: { filter: input.filter, isEnabled: input.isEnabled, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateProcessDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProcessDto>(
      {
        method: 'PUT',
        url: `/api/app/process/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
