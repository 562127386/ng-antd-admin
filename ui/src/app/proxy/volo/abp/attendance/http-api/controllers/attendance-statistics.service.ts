import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { AttendanceStatisticsDto, StatisticsRequestDto } from '../../application/contracts/dtos/models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceStatisticsService {
  private restService = inject(RestService);
  apiName = 'Default';

  batchStatisticsAttendanceByYearAndMonth = (year: number, month: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>(
      {
        method: 'POST',
        url: '/api/attendance/statistics/batch-statistics',
        params: { year, month }
      },
      { apiName: this.apiName, ...config }
    );

  statisticsAttendanceByRequest = (request: StatisticsRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AttendanceStatisticsDto>(
      {
        method: 'POST',
        url: '/api/attendance/statistics/statistics',
        body: request
      },
      { apiName: this.apiName, ...config }
    );
}
