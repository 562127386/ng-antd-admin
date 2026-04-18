import type { CreateUpdateSchedulingRuleDto, SchedulingRuleDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchedulingRuleService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateSchedulingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulingRuleDto>(
      {
        method: 'POST',
        url: '/api/app/scheduling-rule',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/scheduling-rule/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulingRuleDto>(
      {
        method: 'GET',
        url: `/api/app/scheduling-rule/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SchedulingRuleDto>>(
      {
        method: 'GET',
        url: '/api/app/scheduling-rule',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateSchedulingRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SchedulingRuleDto>(
      {
        method: 'PUT',
        url: `/api/app/scheduling-rule/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
