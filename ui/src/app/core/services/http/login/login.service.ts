import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

// import { MENU_TOKEN } from '@config/menu';
import { Menu } from '@core/services/types';
import { BaseHttpService } from '@services/base-http.service';
import { MenusService } from '@services/system/menus.service';

export interface UserLogin {
  userName: string;
  password: string;
}

export interface AbpTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
  scope?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(BaseHttpService);
  httpClient = inject(HttpClient);
  menuService = inject(MenusService);
  // private menus = inject(MENU_TOKEN);

  private abpTokenUrl = '/connect/token';
  private clientId = 'TQMS_App';
  private scope = 'TQMS';

  public login(params: UserLogin): Observable<string> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', params.userName)
      .set('password', params.password)
      .set('client_id', this.clientId)
      .set('scope', this.scope);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.httpClient.post<AbpTokenResponse>(this.abpTokenUrl, body.toString(), { headers }).pipe(
      map(response => response.access_token)
    );
  }

  public loginOut(): Observable<string> {
    return this.http.post('/api/account/logout', null, { needSuccessInfo: false });
  }

  public getMenuByUserAuthCode(userAuthCode: string[]): Observable<Menu[]> {
    const params = {
      MaxResultCount: 1000,
      pageIndex: 0
    };

    return this.menuService.getMenuList(params).pipe(
      map((response) => {
        // 转换后端菜单数据为前端格式
        return response.list.map(menu => ({
          id: menu.id,
          fatherId: menu.parentId || 0,
          menuName: menu.menuName,
          menuType: 'C', // 默认为菜单类型
          icon: menu.icon,
          path: menu.path,
          selected: false,
          open: false,
          code: menu.permission,
          children: []
        }));
      })
    );
  }
}
