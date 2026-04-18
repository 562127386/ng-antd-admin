import type { AqlConfigDto, CreateUpdateAqlConfigDto, GetAqlConfigListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AqlConfigService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateAqlConfigDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AqlConfigDto>(
      {
        method: 'POST',
        url: '/api/app/aql-config',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/aql-config/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  findBestMatch = (samplingSchemeId: string, lotSize: number, aqlValue?: number, inspectionLevel?: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AqlConfigDto>(
      {
        method: 'POST',
        url: `/api/app/aql-config/find-best-match/${samplingSchemeId}`,
        params: { lotSize, aqlValue, inspectionLevel }
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AqlConfigDto>(
      {
        method: 'GET',
        url: `/api/app/aql-config/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetAqlConfigListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<AqlConfigDto>>(
      {
        method: 'GET',
        url: '/api/app/aql-config',
        params: {
          samplingSchemeId: input.samplingSchemeId,
          filter: input.filter,
          aqlValue: input.aqlValue,
          inspectionLevel: input.inspectionLevel,
          isEnabled: input.isEnabled,
          minSampleSize: input.minSampleSize,
          maxSampleSize: input.maxSampleSize,
          lotSize: input.lotSize,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount
        }
      },
      { apiName: this.apiName, ...config }
    );

  setEnabled = (id: string, isEnabled: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AqlConfigDto>(
      {
        method: 'POST',
        url: `/api/app/aql-config/${id}/set-enabled`,
        params: { isEnabled }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateAqlConfigDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AqlConfigDto>(
      {
        method: 'PUT',
        url: `/api/app/aql-config/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
