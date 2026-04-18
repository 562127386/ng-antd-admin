import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { ImportAttendanceRequestDto, ImportAttendanceResultDto } from '../../application/contracts/dtos/models';
import type { IFormFile } from '../../../../../microsoft/asp-net-core/http/models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceRecordsService {
  private restService = inject(RestService);
  apiName = 'Default';

  importAttendanceByFileAndRequest = (file: IFormFile, request: ImportAttendanceRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImportAttendanceResultDto>(
      {
        method: 'POST',
        url: '/api/attendance/records/import',
        body: file
      },
      { apiName: this.apiName, ...config }
    );
}
