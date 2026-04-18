import type { CreateUpdateQualityInspectionPlanDto, GetQualityInspectionPlanListDto, QualityInspectionPlanDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QualityInspectionPlanService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateQualityInspectionPlanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityInspectionPlanDto>(
      {
        method: 'POST',
        url: '/api/app/quality-inspection-plan',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/quality-inspection-plan/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityInspectionPlanDto>(
      {
        method: 'GET',
        url: `/api/app/quality-inspection-plan/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetQualityInspectionPlanListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QualityInspectionPlanDto>>(
      {
        method: 'GET',
        url: '/api/app/quality-inspection-plan',
        params: { filter: input.filter, status: input.status, inspectionType: input.inspectionType, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  publish = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityInspectionPlanDto>(
      {
        method: 'POST',
        url: `/api/app/quality-inspection-plan/${id}/publish`
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateQualityInspectionPlanDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityInspectionPlanDto>(
      {
        method: 'PUT',
        url: `/api/app/quality-inspection-plan/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
