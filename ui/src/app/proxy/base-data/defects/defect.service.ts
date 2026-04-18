import type { CreateUpdateDefectDto, DefectDto, GetDefectListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefectService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateDefectDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DefectDto>(
      {
        method: 'POST',
        url: '/api/app/defect',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/defect/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DefectDto>(
      {
        method: 'GET',
        url: `/api/app/defect/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetDefectListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DefectDto>>(
      {
        method: 'GET',
        url: '/api/app/defect',
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
        method: 'POST',
        url: `/api/app/defect/${id}/set-enabled`,
        params: { isEnabled }
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateDefectDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DefectDto>(
      {
        method: 'PUT',
        url: `/api/app/defect/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
