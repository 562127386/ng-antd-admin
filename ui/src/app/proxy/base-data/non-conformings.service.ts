import type { NonConformingsController_CompleteDisposalInput, NonConformingsController_CompleteReviewInput } from './models';
import type { CreateUpdateNonConformingDto, GetNonConformingListDto, NonConformingDto } from './non-conformings/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NonConformingsService {
  private restService = inject(RestService);
  apiName = 'Default';

  completeDisposal = (id: string, input: NonConformingsController_CompleteDisposalInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'PUT',
        url: `/api/non-conformings/${id}/complete-disposal`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  completeReview = (id: string, input: NonConformingsController_CompleteReviewInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'PUT',
        url: `/api/non-conformings/${id}/complete-review`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateUpdateNonConformingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'POST',
        url: '/api/non-conformings',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  createFromIqcInspection = (inspectionOrderId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'POST',
        url: `/api/non-conformings/create-from-iqc-inspection/${inspectionOrderId}`
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/non-conformings/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'GET',
        url: `/api/non-conformings/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getByOrderNo = (orderNo: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'GET',
        url: `/api/non-conformings/by-order-no/${orderNo}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetNonConformingListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NonConformingDto>>(
      {
        method: 'GET',
        url: '/api/non-conformings',
        params: { filter: input.filter, status: input.status, sourceModule: input.sourceModule, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  startDisposal = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'PUT',
        url: `/api/non-conformings/${id}/start-disposal`
      },
      { apiName: this.apiName, ...config }
    );

  startReview = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'PUT',
        url: `/api/non-conformings/${id}/start-review`
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateNonConformingDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NonConformingDto>(
      {
        method: 'PUT',
        url: `/api/non-conformings/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
