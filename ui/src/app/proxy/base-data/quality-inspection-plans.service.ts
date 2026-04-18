import type { CreateUpdateQualityInspectionPlanDto, GetQualityInspectionPlanListDto, QualityInspectionPlanDto } from './quality-inspection-plans/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QualityInspectionPlansService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateQualityInspectionPlanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityInspectionPlanDto>(
      {
        method: 'POST',
        url: '/api/QualityInspectionPlans',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/QualityInspectionPlans/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityInspectionPlanDto>(
      {
        method: 'GET',
        url: `/api/QualityInspectionPlans/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetQualityInspectionPlanListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QualityInspectionPlanDto>>(
      {
        method: 'GET',
        url: '/api/QualityInspectionPlans',
        params: { filter: input.filter, status: input.status, inspectionType: input.inspectionType, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  publish = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityInspectionPlanDto>(
      {
        method: 'POST',
        url: `/api/QualityInspectionPlans/${id}/publish`
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateQualityInspectionPlanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityInspectionPlanDto>(
      {
        method: 'PUT',
        url: `/api/QualityInspectionPlans/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
