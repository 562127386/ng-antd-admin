import type { CreateUpdateMaterialDto, GetMaterialListDto, MaterialDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateMaterialDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MaterialDto>(
      {
        method: 'POST',
        url: '/api/app/material',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/material/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MaterialDto>(
      {
        method: 'GET',
        url: `/api/app/material/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetMaterialListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MaterialDto>>(
      {
        method: 'GET',
        url: '/api/app/material',
        params: { filter: input.filter, isEnabled: input.isEnabled, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateMaterialDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MaterialDto>(
      {
        method: 'PUT',
        url: `/api/app/material/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
