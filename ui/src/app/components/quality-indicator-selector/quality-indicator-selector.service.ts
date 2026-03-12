import { Injectable, inject } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';

import { QualityIndicatorDto } from '@app/pages/base-data/models/quality-indicator.model';
import { QualityIndicatorSelectorComponent } from './quality-indicator-selector.component';

@Injectable({
  providedIn: 'root'
})
export class QualityIndicatorSelectorService {
  private modalService = inject(NzModalService);

  /**
   * 打开质检指标选择器弹窗
   * @returns 选中的质检指标列表
   */
  openSelector(): Observable<QualityIndicatorDto[]> {
    return new Observable<QualityIndicatorDto[]>(subscriber => {
      // Create modal without component params first
      const modalRef: NzModalRef = this.modalService.create({
        nzTitle: '选择质检指标',
        nzWidth: 1000,
        nzContent: QualityIndicatorSelectorComponent,
        nzFooter: null // 组件内部已实现底部按钮
      });

      // Pass the modalRef to the component instance
      if (modalRef.componentInstance) {
        (modalRef.componentInstance as QualityIndicatorSelectorComponent).modalRef = modalRef;
      }

      modalRef.afterClose.subscribe((result: QualityIndicatorDto[]) => {
        subscriber.next(result || []);
        subscriber.complete();
      });
    });
  }
}
