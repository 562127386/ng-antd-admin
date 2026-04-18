import type { CreateUpdateSamplingSchemeDto, GetSamplingSchemeListDto, SamplingSchemeDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SamplingSchemeService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateSamplingSchemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SamplingSchemeDto>(
      {
        method: 'POST',
        url: '/api/app/sampling-scheme',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/sampling-scheme/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SamplingSchemeDto>(
      {
        method: 'GET',
        url: `/api/app/sampling-scheme/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetSamplingSchemeListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SamplingSchemeDto>>(
      {
        method: 'GET',
        url: '/api/app/sampling-scheme',
        params: { filter: input.filter, isEnabled: input.isEnabled, schemeType: input.schemeType, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  setEnabled = (id: string, isEnabled: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SamplingSchemeDto>(
      {
        method: 'POST',
        url: `/api/app/sampling-scheme/${id}/set-enabled`,
        params: { isEnabled }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateSamplingSchemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SamplingSchemeDto>(
      {
        method: 'PUT',
        url: `/api/app/sampling-scheme/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
