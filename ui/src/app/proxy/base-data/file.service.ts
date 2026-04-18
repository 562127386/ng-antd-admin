import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { IFormFile } from '../microsoft/asp-net-core/http/models';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private restService = inject(RestService);
  apiName = 'Default';

  download = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>(
      {
        method: 'GET',
        responseType: 'blob',
        url: '/api/File/download',
        params: { fileName }
      },
      { apiName: this.apiName, ...config }
    );

  upload = (file: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>(
      {
        method: 'POST',
        responseType: 'text',
        url: '/api/File/upload',
        body: file
      },
      { apiName: this.apiName, ...config }
    );
}
