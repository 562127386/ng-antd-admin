import type { CreateUpdateInspectionRuleDto, CreateUpdateQualityIndicatorDto, InspectionRuleDto, QualityIndicatorDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { GetQualityIndicatorListDto } from '../iqc-inspections/models';

@Injectable({
  providedIn: 'root'
})
export class QualityIndicatorService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateQualityIndicatorDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityIndicatorDto>(
      {
        method: 'POST',
        url: '/api/app/quality-indicator',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  createInspectionRule = (qualityIndicatorId: string, input: CreateUpdateInspectionRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InspectionRuleDto>(
      {
        method: 'POST',
        url: `/api/app/quality-indicator/inspection-rule/${qualityIndicatorId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/quality-indicator/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  deleteInspectionRule = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/quality-indicator/${id}/inspection-rule`
      },
      { apiName: this.apiName, ...config }
    );

  deleteMany = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: '/api/app/quality-indicator/many',
        params: { ids }
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityIndicatorDto>(
      {
        method: 'GET',
        url: `/api/app/quality-indicator/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getAllItems = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityIndicatorDto[]>(
      {
        method: 'GET',
        url: '/api/app/quality-indicator/items'
      },
      { apiName: this.apiName, ...config }
    );

  getInspectionRules = (qualityIndicatorId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InspectionRuleDto[]>(
      {
        method: 'GET',
        url: `/api/app/quality-indicator/inspection-rules/${qualityIndicatorId}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetQualityIndicatorListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QualityIndicatorDto>>(
      {
        method: 'GET',
        url: '/api/app/quality-indicator',
        params: { filter: input.filter, code: input.code, name: input.name, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateQualityIndicatorDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QualityIndicatorDto>(
      {
        method: 'PUT',
        url: `/api/app/quality-indicator/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateInspectionRule = (id: string, input: CreateUpdateInspectionRuleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, InspectionRuleDto>(
      {
        method: 'PUT',
        url: `/api/app/quality-indicator/${id}/inspection-rule`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
