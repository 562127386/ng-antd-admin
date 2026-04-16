import { Injectable } from '@angular/core';
import { RestService } from '@abp/ng.core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  constructor(private rest: RestService) {}

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.rest.request<any, FormData>({
      method: 'POST',
      url: '/api/file/upload',
      body: formData,
      responseType: 'text', //加这一行！告诉前端返回纯文本，不解析JSON
    });
  }

  import(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.rest.request<any, FormData>({
      method: 'POST',
      url: '/api/execl/upload',
      body: formData,
    });
  }

  download(fileName: string): Observable<Blob> {
    return this.rest.request<Blob, any>({
      method: 'GET',
      url: `/api/file/download?fileName=${fileName}`,
      responseType: 'blob',
    });
  }
}