import type {
  BatchSaveRecordsDto,
  CompleteInspectionInput,
  CreateUpdateIqcInspectionOrderDto,
  CreateUpdateIqcInspectionRecordDto,
  GetIqcInspectionOrderListDto,
  IqcInspectionOrderDto,
  IqcInspectionRecordDto
} from './iqc-inspections/models';
import type { RuleEvaluationResult } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IqcInspectionsService {
  private restService = inject(RestService);
  apiName = 'Default';

  cancel = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionOrderDto>(
      {
        method: 'PUT',
        url: `/api/iqc-inspections/${id}/cancel`
      },
      { apiName: this.apiName, ...config }
    );

  completeInspection = (id: string, input: CompleteInspectionInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionOrderDto>(
      {
        method: 'PUT',
        url: `/api/iqc-inspections/${id}/complete`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateUpdateIqcInspectionOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionOrderDto>(
      {
        method: 'POST',
        url: '/api/iqc-inspections',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/iqc-inspections/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  evaluateRule = (rulesJson: string, actualValue: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RuleEvaluationResult[]>(
      {
        method: 'POST',
        url: '/api/iqc-inspections/evaluate-rule',
        params: { rulesJson, actualValue }
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionOrderDto>(
      {
        method: 'GET',
        url: `/api/iqc-inspections/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetIqcInspectionOrderListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<IqcInspectionOrderDto>>(
      {
        method: 'GET',
        url: '/api/iqc-inspections',
        params: {
          filter: input.filter,
          status: input.status,
          result: input.result,
          startDate: input.startDate,
          endDate: input.endDate,
          documentType: input.documentType,
          inspectionPlanCode: input.inspectionPlanCode,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount
        }
      },
      { apiName: this.apiName, ...config }
    );

  saveAllRecords = (input: BatchSaveRecordsDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionOrderDto>(
      {
        method: 'POST',
        url: '/api/iqc-inspections/save-all-records',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  startInspection = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionOrderDto>(
      {
        method: 'PUT',
        url: `/api/iqc-inspections/${id}/start`
      },
      { apiName: this.apiName, ...config }
    );

  submit = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionOrderDto>(
      {
        method: 'PUT',
        url: `/api/iqc-inspections/${id}/submit`
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateIqcInspectionOrderDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionOrderDto>(
      {
        method: 'PUT',
        url: `/api/iqc-inspections/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateInspectionRecord = (orderId: string, recordId: string, input: CreateUpdateIqcInspectionRecordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IqcInspectionRecordDto>(
      {
        method: 'PUT',
        url: `/api/iqc-inspections/${orderId}/records/${recordId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
