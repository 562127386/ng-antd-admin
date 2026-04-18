import type { CreateUpdateSupplierDto, GetSupplierListDto, SupplierDto } from './suppliers/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateSupplierDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupplierDto>(
      {
        method: 'POST',
        url: '/api/suppliers',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/suppliers/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupplierDto>(
      {
        method: 'GET',
        url: `/api/suppliers/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetSupplierListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SupplierDto>>(
      {
        method: 'GET',
        url: '/api/suppliers',
        params: { filter: input.filter, isEnabled: input.isEnabled, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  setEnabled = (id: string, isEnabled: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupplierDto>(
      {
        method: 'PUT',
        url: `/api/suppliers/${id}/enabled`,
        body: isEnabled
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateSupplierDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupplierDto>(
      {
        method: 'PUT',
        url: `/api/suppliers/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
