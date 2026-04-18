import type {
  ColumnSchemaDto,
  CreateColumnSchemaDto,
  CreateFormSchemaDto,
  CreateLookupSchemaDto,
  FormSchemaDto,
  LookupSchemaDto,
  SaveSchemaInput,
  UpdateColumnSchemaDto,
  UpdateFormSchemaDto,
  UpdateLookupSchemaDto
} from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  private restService = inject(RestService);
  apiName = 'Default';

  createColumnSchema = (input: CreateColumnSchemaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ColumnSchemaDto>(
      {
        method: 'POST',
        url: '/api/app/scheme/column-schema',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  createFormSchema = (input: CreateFormSchemaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormSchemaDto>(
      {
        method: 'POST',
        url: '/api/app/scheme/form-schema',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  createLookupSchema = (input: CreateLookupSchemaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LookupSchemaDto>(
      {
        method: 'POST',
        url: '/api/app/scheme/lookup-schema',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  deleteColumnSchema = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/scheme/${id}/column-schema`
      },
      { apiName: this.apiName, ...config }
    );

  deleteFormSchema = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/scheme/${id}/form-schema`
      },
      { apiName: this.apiName, ...config }
    );

  deleteLookupSchema = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/scheme/${id}/lookup-schema`
      },
      { apiName: this.apiName, ...config }
    );

  getColumnSchema = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ColumnSchemaDto>(
      {
        method: 'GET',
        url: `/api/app/scheme/${id}/column-schema`
      },
      { apiName: this.apiName, ...config }
    );

  getColumnSchemas = (entityName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ColumnSchemaDto[]>(
      {
        method: 'GET',
        url: '/api/app/scheme/column-schemas',
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );

  getFormSchema = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormSchemaDto>(
      {
        method: 'GET',
        url: `/api/app/scheme/${id}/form-schema`
      },
      { apiName: this.apiName, ...config }
    );

  getFormSchemas = (entityName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormSchemaDto[]>(
      {
        method: 'GET',
        url: '/api/app/scheme/form-schemas',
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );

  getLookupSchema = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LookupSchemaDto>(
      {
        method: 'GET',
        url: `/api/app/scheme/${id}/lookup-schema`
      },
      { apiName: this.apiName, ...config }
    );

  getLookupSchemas = (entityName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LookupSchemaDto[]>(
      {
        method: 'GET',
        url: '/api/app/scheme/lookup-schemas',
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );

  saveSchema = (input: SaveSchemaInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/scheme/save-schema',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateColumnSchema = (id: string, input: UpdateColumnSchemaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ColumnSchemaDto>(
      {
        method: 'PUT',
        url: `/api/app/scheme/${id}/column-schema`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateFormSchema = (id: string, input: UpdateFormSchemaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormSchemaDto>(
      {
        method: 'PUT',
        url: `/api/app/scheme/${id}/form-schema`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateLookupSchema = (id: string, input: UpdateLookupSchemaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LookupSchemaDto>(
      {
        method: 'PUT',
        url: `/api/app/scheme/${id}/lookup-schema`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
