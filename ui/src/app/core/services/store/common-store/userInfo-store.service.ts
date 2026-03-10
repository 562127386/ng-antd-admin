import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '@services/system/account.service';
import { MenusService } from '../../http/system/menus.service';
import { PageInfo, SearchCommonVO } from '../../types';

export interface UserInfo {
  userName: string;
  userId: number | string;
  authCode: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoStoreService {
  $userInfo = signal<UserInfo>({ userId: -1, userName: '', authCode: [] });

  userService = inject(AccountService);
  menuService = inject(MenusService);
  parsToken(token: string): UserInfo {
    const helper = new JwtHelperService();
    try {
      const decoded = helper.decodeToken(token);
      const userName = decoded.name || decoded.preferred_username || decoded.unique_name || decoded.sub;
      const userId = decoded.sub || decoded.nameid || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      return {
        userId: userId || -1,
        userName: userName || 'Unknown',
        authCode: []
      };
    } catch (e) {
      console.error('Error parsing token:', e);
      return {
        userId: -1,
        userName: '',
        authCode: []
      };
    }
  }

  getUserAuthCodeByUserId(userId: number | string): Observable<string[]> {

     const params: SearchCommonVO<any> = {
      MaxResultCount: 1000,
      pageIndex: 0,
    };
    return this.menuService
      .getMenuList(params)
      .pipe(
        map((menuList: PageInfo<any>) => {
          return menuList.list
            .map((menu: any) => menu.permission)
            .filter((permission: string | undefined): permission is string => permission !== undefined && permission !== null);
        })
      );

    //return this.userService.getAccountAuthCode(userId.toString());
  }
}
