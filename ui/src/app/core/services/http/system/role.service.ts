import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';

/*
 *  权限
 * */
export interface permission {
  hasChildren: boolean;
  menuName: string;
  code: string;
  fatherId: string;
  id: string;
  menuGrade: number; // 级别
  permissionVo: permission[];
  isOpen?: boolean; // 是否折叠
  checked: boolean;
}

// 更新权限参数接口
export interface PutpermissionParam {
  permCodes: string[];
  roleId: string;
}

/*
 * 角色
 * */
export interface Role {
  id?: string;
  name: string;
  displayName: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  http = inject(BaseHttpService);

  public getRoles(param: SearchCommonVO<Role>): Observable<PageInfo<Role>> {
    return this.http.get('/api/identity/roles', {
      params: {
        skipCount: ((param.pageIndex || 1) - 1) * (param.MaxResultCount || 10),
        maxResultCount: param.MaxResultCount || 10,
        filter: param.filters?.name
      },
      showLoading: true,
      loadingText: '请求中',
      isAbpApi: true
    });
  }

  public getRolesDetail(id: string): Observable<Role> {
    return this.http.get(`/api/identity/roles/${id}`, { isAbpApi: true });
  }

  public addRoles(param: Role): Observable<void> {
    const data = {
      name: param.name,
      displayName: param.displayName,
      description: param.description
    };
    return this.http.post('/api/identity/roles', data, { needSuccessInfo: true, isAbpApi: true });
  }

  public delRoles(ids: string[]): Observable<void> {
    return this.http.delete(`/api/identity/roles/${ids.join(',')}`, { needSuccessInfo: true, isAbpApi: true });
  }

  public editRoles(param: Role): Observable<void> {
    const data = {
      name: param.name,
      displayName: param.displayName,
      description: param.description
    };
    return this.http.put(`/api/identity/roles/${param.id}`, data, { needSuccessInfo: true, isAbpApi: true });
  }

  public getpermissionById(id: string): Observable<string[]> {
    return this.http.get(`/api/identity/roles/${id}/permissions`, { isAbpApi: true });
  }

  public updatepermission(param: PutpermissionParam): Observable<NzSafeAny> {
    const data = {
      grantedpermissionNames: param.permCodes
    };
    return this.http.put(`/api/identity/roles/${param.roleId}/permissions`, data, { isAbpApi: true });
  }
}
