import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '@services/system/account.service';

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
    return of(['Dashboard', 'BaseData', 'Defects', 'Materials', 'Processes','InspectionStandards','AqlConfigs','SamplingSchemes','Suppliers','QualityReports','GeneralInspectionItems',
      'InspectionService','IqcInspections',
      'Exception','NonConformings'
    ]);
  }
}
