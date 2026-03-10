import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Menu, PageInfo, SearchCommonVO } from '@core/services/types';
import { BaseHttpService } from '@services/base-http.service';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

export interface MenuListObj {
  id?: string;
  menuName: string;
  Permission: string;
  alIcon: string;
  icon: string;
  orderNum: number;
  menuType: 'C' | 'F'; // c:菜单，f按钮
  path: string;
  IsExternal: boolean;
  IsDisabled: boolean;
  newLinkFlag: 0 | 1;
  parentId?: string;
  ExternalUrl?: string;
  Component?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  http = inject(BaseHttpService);

  public getMenuList(param: SearchCommonVO<NzSafeAny>): Observable<PageInfo<Menu>> {
    const params = {
      skipCount: ((param.pageIndex || 1) - 1) * (param.MaxResultCount || 10),
      maxResultCount: param.MaxResultCount || 10
    };
    return this.http.get('/api/base-data/menus', params, {
      isAbpApi: true
    }).pipe(
      map((response: any) => ({
        pageIndex: param.pageIndex || 1,
        pageSize: param.MaxResultCount || 10,
        total: response.totalCount,
        list: response.items || []
        // list: (response.items || []).map((item: any) => ({
        //   ...item,
        //   menuName: item.MenuName, // 确保menuName字段正确赋值
        //   fatherId: item.ParentId || 0, // 确保fatherId字段正确赋值
        //   code: item.permission, // 确保code字段正确赋值
        //   status: item.IsDisabled // 确保status字段正确赋值
        // }))
      }))
    );
  }

  public addMenus(param: MenuListObj): Observable<void> {
    return this.http.post('/api/base-data/menus', param, { needSuccessInfo: true, isAbpApi: true });
  }

  public editMenus(param: MenuListObj): Observable<void> {
    return this.http.put(`/api/base-data/menus/${param.id}`, param, { needSuccessInfo: true, isAbpApi: true });
  }

  public delMenus(id: string): Observable<void> {
    return this.http.delete(`/api/base-data/menus/${id}`, undefined, {
      needSuccessInfo: true, 
      isAbpApi: true
    });
  }

  public getMenuDetail(id: string): Observable<MenuListObj> {
    return this.http.get(`/api/base-data/menus/${id}`, undefined, {
      isAbpApi: true
    });
  }

  public getMenuTree(param: SearchCommonVO<NzSafeAny>): Observable<Menu[]> {
    const params = {
      filter: param.filters?.menuName,
      skipCount: ((param.pageIndex || 1) - 1) * (param.MaxResultCount || 10),
      maxResultCount: param.MaxResultCount || 10
    };
    return this.http.get<any[]>('/api/base-data/menus/tree', params, {
      isAbpApi: true
    }).pipe(
      map((menus) => {
        // 递归转换菜单数据
        const convertMenu = (menu: any): Menu => {
          return {
            ...menu,
            menuName: menu.MenuName, // 确保menuName字段正确赋值
            fatherId: menu.ParentId || 0, // 确保fatherId字段正确赋值
            code: menu.Permission, // 确保code字段正确赋值
            status: menu.IsDisabled, // 确保status字段正确赋值
            children: menu.children ? menu.children.map((child: any) => convertMenu(child)) : []
          };
        };
        return menus.map(convertMenu);
      })
    );
  }
}
