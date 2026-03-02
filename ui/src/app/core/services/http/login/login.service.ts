import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

// import { MENU_TOKEN } from '@config/menu';
import { Menu } from '@core/services/types';
import { BaseHttpService } from '@services/base-http.service';
// import { MenusService } from '@services/system/menus.service';

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
    return this.http.post('/auth/signout', null, { needSuccessInfo: false });
  }

  public getMenuByUserAuthCode(userAuthCode: string[]): Observable<Menu[]> {
    const menus: Menu[] = [
      {
        id: 1,
        fatherId: 0,
        menuName: '首页',
        menuType: 'C',
        icon: 'home',
        path: '/default/dashboard/analysis',
        selected: false,
        open: false,
        code: 'Dashboard',
        children: []
      },
      {
        id: 2,
        fatherId: 0,
        menuName: '基础数据',
        menuType: 'C',
        icon: 'database',
        path: '/default/base-data',
        selected: false,
        open: false,
        code: 'BaseData',
        children: [
          {
            id: 21,
            fatherId: 2,
            menuName: '缺陷管理',
            menuType: 'C',
            icon: 'warning',
            path: '/default/base-data/defects',
            selected: false,
            open: false,
            code: 'Defects',
            children: []
          },
          {
            id: 22,
            fatherId: 2,
            menuName: '物料管理',
            menuType: 'C',
            icon: 'inbox',
            path: '/default/base-data/materials',
            selected: false,
            open: false,
            code: 'Materials',
            children: []
          },
          {
            id: 23,
            fatherId: 2,
            menuName: '工序管理',
            menuType: 'C',
            icon: 'project',
            path: '/default/base-data/processes',
            selected: false,
            open: false,
            code: 'Processes',
            children: []
          }
        ]
      }
    ];
    return of(menus);
  }
}
