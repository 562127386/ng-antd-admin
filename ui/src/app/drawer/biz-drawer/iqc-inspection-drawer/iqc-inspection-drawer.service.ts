import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DrawerWrapService } from '@app/drawer/base-drawer';
import { IqcInspectionDrawerComponent } from '@app/drawer/biz-drawer/iqc-inspection-drawer/iqc-inspection-drawer.component';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDrawerOptions } from 'ng-zorro-antd/drawer';

@Injectable({
  providedIn: 'root'
})
export class IqcInspectionDrawerService {
  private drawerWrapService = inject(DrawerWrapService);

  protected getContentComponent(): NzSafeAny {
    return IqcInspectionDrawerComponent;
  }

  public show(options: NzDrawerOptions = {}, params?: { mode: 'view' | 'edit' | 'create'; id?: string }): Observable<NzSafeAny> {
    const defaultOptions: NzDrawerOptions = {
     // nzSize: 'large',
     nzWidth:'80%',
      ...options
    };
    return this.drawerWrapService.show(this.getContentComponent(), defaultOptions, params);
  }
}
