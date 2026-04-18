import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { IFormFile } from '../microsoft/asp-net-core/http/models';
import type { FileResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';
import type { AttendanceJudgmentResultRequestDto } from '../volo/abp/attendance/application/contracts/dtos/models';

@Injectable({
  providedIn: 'root'
})
export class ExeclService {
  private restService = inject(RestService);
  apiName = 'Default';

  download = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>(
      {
        method: 'GET',
        responseType: 'blob',
        url: '/api/Execl/download',
        params: { fileName }
      },
      { apiName: this.apiName, ...config }
    );

  exportByTemplateByInput = (input: AttendanceJudgmentResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FileResult>(
      {
        method: 'POST',
        url: '/api/Execl/export-by-template',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  upload = (file: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>(
      {
        method: 'POST',
        url: '/api/Execl/upload',
        body: file
      },
      { apiName: this.apiName, ...config }
    );
}
