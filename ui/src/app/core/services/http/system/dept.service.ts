import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';

/*
 *  部门列表
 * */
export interface Dept {
  id?: string;
  displayName: string;
  parentId: string | null;
  code?: string;
  isActive?: boolean;
  order?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeptService {
  http = inject(BaseHttpService);

  public getDepts(param: SearchCommonVO<Dept>): Observable<PageInfo<Dept>> {
    return this.http.get('/api/identity/organization-units', {
      params: {
        skipCount: ((param.pageIndex || 1) - 1) * (param.MaxResultCount || 10),
        maxResultCount: param.MaxResultCount || 10,
        filter: param.filters?.displayName
      }
    });
  }

  public getDeptsDetail(id: string): Observable<Dept> {
    return this.http.get(`/api/identity/organization-units/${id}`);
  }

  public addDepts(param: Dept): Observable<void> {
    const data = {
      displayName: param.displayName,
      parentId: param.parentId,
      code: param.code
    };
    return this.http.post('/api/identity/organization-units', data, { needSuccessInfo: true });
  }

  public delDepts(ids: string[]): Observable<void> {
    return this.http.delete(`/api/identity/organization-units/${ids.join(',')}`, { needSuccessInfo: true });
  }

  public editDepts(param: Dept): Observable<void> {
    const data = {
      displayName: param.displayName,
      parentId: param.parentId,
      code: param.code
    };
    return this.http.put(`/api/identity/organization-units/${param.id}`, data, { needSuccessInfo: true });
  }
}
