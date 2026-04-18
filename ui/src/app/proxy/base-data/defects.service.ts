import type { CreateUpdateDefectDto, DefectDto, GetDefectListDto } from './defects/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefectsService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateDefectDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DefectDto>(
      {
        method: 'POST',
        url: '/api/Defects',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/Defects/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DefectDto>(
      {
        method: 'GET',
        url: `/api/Defects/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetDefectListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DefectDto>>(
      {
        method: 'GET',
        url: '/api/Defects',
        params: {
          filter: input.filter,
          category: input.category,
          severity: input.severity,
          module: input.module,
          isEnabled: input.isEnabled,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount
        }
      },
      { apiName: this.apiName, ...config }
    );

  setEnabled = (id: string, isEnabled: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'PUT',
        url: `/api/Defects/${id}/enabled`,
        body: isEnabled
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateDefectDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DefectDto>(
      {
        method: 'PUT',
        url: `/api/Defects/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
