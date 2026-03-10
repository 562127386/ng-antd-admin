import { inject, Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { PageInfo, SearchCommonVO } from '../../types';
import { BaseHttpService } from '../base-http.service';

/*
 * 用户管理
 * */
export interface User {
  id: string;
  userName?: string;
  name?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  roleNames?: string[];
  lastLoginTime?: Date;
  departmentId?: string;
  departmentName?: string;
  password?: string;
}

/*
 * 用户修改密码
 * */
export interface UserPsd {
  id: string;
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  http = inject(BaseHttpService);

  public getAccount(param: SearchCommonVO<User>): Observable<PageInfo<User>> {
    return this.http.get('/api/identity/users', {
      params: {
        skipCount: ((param.pageIndex || 1) - 1) * (param.MaxResultCount || 10),
        maxResultCount: param.MaxResultCount || 10,
        filter: param.filters?.userName
      },
      isAbpApi: true
    });
  }

  public getAccountDetail(id: string): Observable<User> {
    return this.http.get(`/api/identity/users/${id}`, { isAbpApi: true });
  }

  public getAccountAuthCode(id: string): Observable<string[]> {
    // 先获取用户的角色
    return this.http.get<any>(`/api/identity/users/${id}/roles`, { isAbpApi: true }).pipe(
      switchMap((response: any) => {
        // 处理API返回的数据结构，ABP通常返回包含items属性的对象
        const roles = response.items || response;
        if (!Array.isArray(roles) || roles.length === 0) {
          return of([]);
        }
        // 为每个角色获取权限
        const rolepermissionObservables = roles.map(role => 
          this.http.get<string[]>(`/api/identity/roles/${role.id}/permissions`, { isAbpApi: true })
        );
        // 合并所有角色的权限
        return forkJoin(rolepermissionObservables).pipe(
          map(permissionsArray => {
            // 合并所有权限并去重
            const allpermissions = permissionsArray.reduce((acc, permissions) => acc.concat(permissions), []);
            return [...new Set(allpermissions)];
          })
        );
      })
    );
  }

  public addAccount(param: User): Observable<void> {
    const data = {
      userName: param.userName,
      name: param.name,
      surname: param.surname,
      email: param.email,
      phoneNumber: param.phoneNumber,
      isActive: param.isActive,
      password: param.password
    };
    return this.http.post('/api/identity/users', data, { needSuccessInfo: true, isAbpApi: true });
  }

  public delAccount(ids: string[]): Observable<void> {
    return this.http.delete(`/api/identity/users/${ids.join(',')}`, { needSuccessInfo: true, isAbpApi: true });
  }

  public editAccount(param: User): Observable<void> {
    const data = {
      userName: param.userName,
      name: param.name,
      surname: param.surname,
      email: param.email,
      phoneNumber: param.phoneNumber,
      isActive: param.isActive
    };
    return this.http.put(`/api/identity/users/${param.id}`, data, { needSuccessInfo: true, isAbpApi: true });
  }

  public editAccountPsd(param: UserPsd): Observable<void> {
    const data = {
      currentPassword: param.oldPassword,
      newPassword: param.newPassword
    };
    return this.http.post(`/api/identity/users/${param.id}/change-password`, data, { isAbpApi: true });
  }
}
