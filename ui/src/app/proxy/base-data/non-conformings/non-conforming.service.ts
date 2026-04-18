import type { CreateUpdateNonConformingDto, GetNonConformingListDto, NonConformingDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { InspectionResult } from '../../enums/inspection-result.enum';
import type { ReviewResult } from '../../enums/review-result.enum';

@Injectable({
  providedIn: 'root'
})
export class NonConformingService {
  private restService = inject(RestService);
  apiName = 'Default';

  completeDisposal = (id: string, reInspectionResult: InspectionResult, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'POST',
        url: `/api/app/non-conforming/${id}/complete-disposal`,
        params: { reInspectionResult }
      },
      { apiName: this.apiName, ...config }
    );

  completeReview = (
    id: string,
    reviewResult: ReviewResult,
    reworkQty: number,
    repairQty: number,
    scrapQty: number,
    responsiblePerson: string,
    responsibleDept: string,
    responsibleSupplier: string,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'POST',
        url: `/api/app/non-conforming/${id}/complete-review`,
        params: { reviewResult, reworkQty, repairQty, scrapQty, responsiblePerson, responsibleDept, responsibleSupplier }
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateUpdateNonConformingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'POST',
        url: '/api/app/non-conforming',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  createFromIqcInspection = (inspectionOrderId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'POST',
        url: `/api/app/non-conforming/from-iqc-inspection/${inspectionOrderId}`
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/non-conforming/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'GET',
        url: `/api/app/non-conforming/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getByOrderNo = (orderNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'GET',
        url: '/api/app/non-conforming/by-order-no',
        params: { orderNo }
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetNonConformingListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NonConformingDto>>(
      {
        method: 'GET',
        url: '/api/app/non-conforming',
        params: { filter: input.filter, status: input.status, sourceModule: input.sourceModule, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  startDisposal = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'POST',
        url: `/api/app/non-conforming/${id}/start-disposal`
      },
      { apiName: this.apiName, ...config }
    );

  startReview = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'POST',
        url: `/api/app/non-conforming/${id}/start-review`
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateNonConformingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'PUT',
        url: `/api/app/non-conforming/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
