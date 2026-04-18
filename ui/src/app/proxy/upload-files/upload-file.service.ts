import type { CreateUploadFileDto, GetUploadFileListDto, UpdateUploadFileDto, UploadFileDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUploadFileDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UploadFileDto>(
      {
        method: 'POST',
        url: '/api/app/upload-file',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/upload-file/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UploadFileDto>(
      {
        method: 'GET',
        url: `/api/app/upload-file/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetUploadFileListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UploadFileDto>>(
      {
        method: 'GET',
        url: '/api/app/upload-file',
        params: { entityName: input.entityName, recordId: input.recordId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  getListByEntity = (entityName: string, recordId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UploadFileDto>>(
      {
        method: 'GET',
        url: `/api/app/upload-file/by-entity/${recordId}`,
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: UpdateUploadFileDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UploadFileDto>(
      {
        method: 'PUT',
        url: `/api/app/upload-file/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
