import type { CreateUpdatePublicHolidayDto, PublicHolidayDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicHolidayService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdatePublicHolidayDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PublicHolidayDto>(
      {
        method: 'POST',
        url: '/api/app/public-holiday',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/public-holiday/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PublicHolidayDto>(
      {
        method: 'GET',
        url: `/api/app/public-holiday/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PublicHolidayDto>>(
      {
        method: 'GET',
        url: '/api/app/public-holiday',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdatePublicHolidayDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PublicHolidayDto>(
      {
        method: 'PUT',
        url: `/api/app/public-holiday/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
