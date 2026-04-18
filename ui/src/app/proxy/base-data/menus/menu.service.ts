import type { CreateUpdateMenuDto, GetMenuListDto, MenuDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private restService = inject(RestService);
  apiName = 'Default';

  batchDelete = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/menu/batch-delete',
        body: ids
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateUpdateMenuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MenuDto>(
      {
        method: 'POST',
        url: '/api/app/menu',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/menu/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MenuDto>(
      {
        method: 'GET',
        url: `/api/app/menu/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetMenuListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MenuDto>>(
      {
        method: 'GET',
        url: '/api/app/menu',
        params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  getMenuTree = (input: GetMenuListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MenuDto[]>(
      {
        method: 'GET',
        url: '/api/app/menu/menu-tree',
        params: { filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateMenuDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MenuDto>(
      {
        method: 'PUT',
        url: `/api/app/menu/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
