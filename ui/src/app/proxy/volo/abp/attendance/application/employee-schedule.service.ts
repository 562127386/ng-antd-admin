import type { CreateUpdateEmployeeScheduleDto, EmployeeScheduleDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeScheduleService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateEmployeeScheduleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, EmployeeScheduleDto>(
      {
        method: 'POST',
        url: '/api/app/employee-schedule',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/employee-schedule/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, EmployeeScheduleDto>(
      {
        method: 'GET',
        url: `/api/app/employee-schedule/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<EmployeeScheduleDto>>(
      {
        method: 'GET',
        url: '/api/app/employee-schedule',
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateEmployeeScheduleDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, EmployeeScheduleDto>(
      {
        method: 'PUT',
        url: `/api/app/employee-schedule/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
