import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { CreateUpdateMenuDto, GetMenuListDto, MenuDto } from '../../../base-data/menus/models';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  private restService = inject(RestService);
  apiName = 'Default';

  batchDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: '/api/base-data/menus/batch',
        body: ids
      },
      { apiName: this.apiName, ...config }
    );

  createByInput = (input: CreateUpdateMenuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MenuDto>(
      {
        method: 'POST',
        url: '/api/base-data/menus',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  deleteById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/base-data/menus/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getById = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MenuDto>(
      {
        method: 'GET',
        url: `/api/base-data/menus/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getListByInput = (input: GetMenuListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MenuDto>>(
      {
        method: 'GET',
        url: '/api/base-data/menus',
        params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  getMenuTreeByInput = (input: GetMenuListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MenuDto[]>(
      {
        method: 'GET',
        url: '/api/base-data/menus/tree',
        params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  updateByIdAndInput = (id: string, input: CreateUpdateMenuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MenuDto>(
      {
        method: 'PUT',
        url: `/api/base-data/menus/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
