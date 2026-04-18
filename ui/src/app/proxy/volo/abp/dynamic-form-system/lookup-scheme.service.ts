import type { CreateLookupConfigSchemeDto, LookupConfigSchemeDto, UpdateLookupConfigSchemeDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LookupSchemeService {
  private restService = inject(RestService);
  apiName = 'Default';

  createLookupScheme = (input: CreateLookupConfigSchemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LookupConfigSchemeDto>(
      {
        method: 'POST',
        url: '/api/app/lookup-scheme/lookup-scheme',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  deleteLookupScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/lookup-scheme/${id}/lookup-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  getLookupScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LookupConfigSchemeDto>(
      {
        method: 'GET',
        url: `/api/app/lookup-scheme/${id}/lookup-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  getLookupSchemes = (entityName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LookupConfigSchemeDto[]>(
      {
        method: 'GET',
        url: '/api/app/lookup-scheme/lookup-schemes',
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );

  setDefaultLookupScheme = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/lookup-scheme/${id}/set-default-lookup-scheme`
      },
      { apiName: this.apiName, ...config }
    );

  updateLookupScheme = (id: string, input: UpdateLookupConfigSchemeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LookupConfigSchemeDto>(
      {
        method: 'PUT',
        url: `/api/app/lookup-scheme/${id}/lookup-scheme`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
