import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Observable, of } from 'rxjs';
import { BasicConfirmModalComponent } from '@widget/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { IqcInspectionOrderDto } from '../../models/iqc-inspection.model';
import { InspectionResult, ItemJudgment } from '../../models/enums';

@Component({
  selector: 'app-complete-inspection-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzCardModule,
    NzDescriptionsModule,
    NzTagModule,
    NzIconModule,
    NzDividerModule,
    NzAlertModule,
    NzInputModule
  ],
  templateUrl: './complete-inspection-modal.component.html',
  styleUrls: ['./complete-inspection-modal.component.less']
})
export class CompleteInspectionModalComponent extends BasicConfirmModalComponent implements OnInit {
  private fb = inject(FormBuilder);

  readonly nzModalData: { inspectionOrder: IqcInspectionOrderDto } = inject(NZ_MODAL_DATA);
  override modalRef = inject(NzModalRef);

  completeForm!: FormGroup;
  okCount = 0;
  ngCount = 0;
  pendingCount = 0;
  totalCount = 0;
  suggestedResult: InspectionResult = InspectionResult.Accepted;

  resultOptions = [
    { label: '合格', value: InspectionResult.Accepted, color: 'success' },
    { label: '特采', value: InspectionResult.Concession, color: 'warning' },
    { label: '不合格', value: InspectionResult.Rejected, color: 'error' },
    { label: '挑选', value: InspectionResult.Sorting, color: 'processing' }
  ];

  get inspectionOrder(): IqcInspectionOrderDto {
    return this.nzModalData.inspectionOrder;
  }

  ngOnInit(): void {
    this.initForm();
    this.calculateStatistics();
  }

  initForm(): void {
    this.completeForm = this.fb.group({
      result: [null, [Validators.required]],
      remark: ['']
    });
  }

  calculateStatistics(): void {
    if (!this.inspectionOrder?.records) {
      return;
    }

    this.totalCount = this.inspectionOrder.records.length;
    this.okCount = this.inspectionOrder.records.filter(r => r.judgment === ItemJudgment.OK).length;
    this.ngCount = this.inspectionOrder.records.filter(r => r.judgment === ItemJudgment.NG).length;
    this.pendingCount = this.inspectionOrder.records.filter(r => r.judgment === ItemJudgment.Pending || r.judgment === undefined || r.judgment === null).length;

    if (this.ngCount > 0) {
      this.suggestedResult = InspectionResult.Rejected;
    } else if (this.pendingCount > 0) {
      this.suggestedResult = InspectionResult.Accepted;
    } else {
      this.suggestedResult = InspectionResult.Accepted;
    }

    this.completeForm.patchValue({
      result: this.suggestedResult
    });
  }

  getResultColor(result?: number): string {
    if (result === undefined || result === null) return 'default';
    const option = this.resultOptions.find(o => o.value === result);
    return option ? option.color : 'default';
  }

  getResultText(result?: number): string {
    if (result === undefined || result === null) return '';
    const option = this.resultOptions.find(o => o.value === result);
    return option ? option.label : '';
  }

  getCurrentValue(): Observable<NzSafeAny> {
    if (this.completeForm.invalid) {
      Object.values(this.completeForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return of(false);
    }

    return of({
      result: this.completeForm.value.result,
      remark: this.completeForm.value.remark
    });
  }
}
