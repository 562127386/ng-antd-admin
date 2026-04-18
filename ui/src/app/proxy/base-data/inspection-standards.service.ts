import type { CreateUpdateInspectionStandardDto, GetInspectionStandardListDto, InspectionStandardDto } from './inspection-standards/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InspectionStandardsService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateInspectionStandardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InspectionStandardDto>(
      {
        method: 'POST',
        url: '/api/InspectionStandards',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/InspectionStandards/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InspectionStandardDto>(
      {
        method: 'GET',
        url: `/api/InspectionStandards/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetInspectionStandardListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<InspectionStandardDto>>(
      {
        method: 'GET',
        url: '/api/InspectionStandards',
        params: { filter: input.filter, status: input.status, inspectionType: input.inspectionType, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  publish = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InspectionStandardDto>(
      {
        method: 'POST',
        url: `/api/InspectionStandards/${id}/publish`
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateInspectionStandardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InspectionStandardDto>(
      {
        method: 'PUT',
        url: `/api/InspectionStandards/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
