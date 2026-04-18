import type { CreateFilterConfigSchemeDto, FilterConfigSchemeDto, UpdateFilterConfigSchemeDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterSchemeService {
  private restService = inject(RestService);
  apiName = 'Default';

  createFilterScheme = (input: CreateFilterConfigSchemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FilterConfigSchemeDto>(
      {
        method: 'POST',
        url: '/api/app/filter-scheme/filter-scheme',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  deleteFilterScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/filter-scheme/${id}/filter-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  getFilterScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FilterConfigSchemeDto>(
      {
        method: 'GET',
        url: `/api/app/filter-scheme/${id}/filter-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  getFilterSchemes = (entityName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FilterConfigSchemeDto[]>(
      {
        method: 'GET',
        url: '/api/app/filter-scheme/filter-schemes',
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );

  setDefaultFilterScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/filter-scheme/${id}/set-default-filter-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  updateFilterScheme = (id: string, input: UpdateFilterConfigSchemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FilterConfigSchemeDto>(
      {
        method: 'PUT',
        url: `/api/app/filter-scheme/${id}/filter-scheme`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
