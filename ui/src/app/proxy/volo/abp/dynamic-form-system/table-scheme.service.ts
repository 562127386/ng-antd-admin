import type { CreateTableConfigSchemeDto, TableConfigSchemeDto, UpdateTableConfigSchemeDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableSchemeService {
  private restService = inject(RestService);
  apiName = 'Default';

  createTableScheme = (input: CreateTableConfigSchemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TableConfigSchemeDto>(
      {
        method: 'POST',
        url: '/api/app/table-scheme/table-scheme',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  deleteTableScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/table-scheme/${id}/table-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  getTableScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TableConfigSchemeDto>(
      {
        method: 'GET',
        url: `/api/app/table-scheme/${id}/table-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  getTableSchemes = (entityName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TableConfigSchemeDto[]>(
      {
        method: 'GET',
        url: '/api/app/table-scheme/table-schemes',
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );

  setDefaultTableScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/table-scheme/${id}/set-default-table-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  updateTableScheme = (id: string, input: UpdateTableConfigSchemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, TableConfigSchemeDto>(
      {
        method: 'PUT',
        url: `/api/app/table-scheme/${id}/table-scheme`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
