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
import { NzListModule } from 'ng-zorro-antd/list';
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
    NzInputModule,
    NzListModule
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

  totalSamples = 0;
  qualifiedSamples = 0;//合格样品
  unqualifiedSamples = 0;//不合格样品
  incompleteSamples = 0;//未完成检测样品
  unqualifiedRate = 0;

  resultOptions = [
    { label: '合格', value: InspectionResult.Accepted, color: 'success' },
    { label: '特采', value: InspectionResult.Concession, color: 'warning' },
    { label: '不合格', value: InspectionResult.Rejected, color: 'error' },
    { label: '挑选', value: InspectionResult.Sorting, color: 'processing' }
  ];

  get inspectionOrder(): IqcInspectionOrderDto {
    return this.nzModalData.inspectionOrder;
  }

  getUnqualifiedItems(): any[] {
    if (!this.inspectionOrder?.records) {
      return [];
    }
    // 基于 samples 集合中的 judgment 来统计不合格样品
    return this.inspectionOrder.records.filter(r => {
      const samples = r.samples || [];
      return samples.some(s => s.judgment === ItemJudgment.NG);
    });
  }

  getPendingItems(): any[] {
    if (!this.inspectionOrder?.records) {
      return [];
    }
    // 基于 samples 集合中的 judgment 来统计待判定样品
    return this.inspectionOrder.records.filter(r => {
      const samples = r.samples || [];
      return samples.some(s => s.judgment === ItemJudgment.Pending  && s.sampleValue != null && s.sampleValue.trim() !== '');//|| s.judgment === undefined || s.judgment === null
    });
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

    this.totalSamples = this.inspectionOrder.sampleSize || 0;
    if(this.totalSamples === 0)
    { 
      this.totalSamples =Math.max(//取样本数最多的一个 当样本数
          // 先把所有 samples 长度取出来，没有则为 0
          ...(this.inspectionOrder.records?.map(record => record.samples?.length || 0) || [0])
        );
        this.inspectionOrder.sampleSize=this.totalSamples;
    }
    const ac = this.inspectionOrder.acceptanceNumber || 0;
    let re = this.inspectionOrder.rejectionNumber || 0;
    if (re === 0) {
      re = 1;
      this.inspectionOrder.rejectionNumber =1;
    }

    if (this.unqualifiedSamples >= re || this.ngCount > 0) {
      this.suggestedResult = InspectionResult.Rejected;
    } else if (this.unqualifiedSamples <= ac) {
      this.suggestedResult = InspectionResult.Accepted;
    } else {
      this.suggestedResult = InspectionResult.Concession; 
    }

    this.calculateSampleStatistics();
    const remark = this.generateRemark(ac, re);
    this.completeForm.patchValue({
      result: this.suggestedResult,
      remark: remark
    });
  }

  calculateSampleStatistics(): void {
    const records = this.inspectionOrder.records || [];
    const sampleSize = this.inspectionOrder.sampleSize || 0;
    
    if (sampleSize === 0 || records.length === 0) {
      this.qualifiedSamples = 0;
      this.unqualifiedSamples = 0;
      this.incompleteSamples = 0;
      this.unqualifiedRate = 0;
      return;
    }

    const sampleJudgments: Map<number, number[]> = new Map();
    
    for (let i = 1; i <= sampleSize; i++) {
      sampleJudgments.set(i, []);
    }

    for (const record of records) {
      const samples = record.samples || [];
      for (const sample of samples) {
        const sampleNo = sample.sampleNo || 1;
        if (sampleJudgments.has(sampleNo)) {
          sampleJudgments.get(sampleNo)!.push(sample.judgment);
        }
      }
    }

    let qualified = 0;
    let unqualified = 0;
    let incomplete = 0;

    sampleJudgments.forEach((judgments) => {
      if (judgments.length === 0) {
        incomplete++;
      } else if (judgments.some(j => j === ItemJudgment.NG)) {
        unqualified++;
      } else if (judgments.some(j => j === ItemJudgment.Pending || j === undefined || j === null)) {
        incomplete++;
      } else {
        qualified++;
      }
    });

    this.qualifiedSamples = qualified;
    this.unqualifiedSamples = unqualified;
    this.incompleteSamples = incomplete;
    this.unqualifiedRate = sampleSize > 0 ? Math.round((unqualified / sampleSize) * 10000) / 100 : 0;
  }

  generateRemark(ac: number, re: number): string {
    const sampleSize = this.inspectionOrder.sampleSize || 0;
    const remark = `检验样本数${sampleSize}，合格${this.qualifiedSamples}样品，不合格${this.unqualifiedSamples}样品，未检测完成${this.incompleteSamples}样品，`;
    const rate = this.unqualifiedRate > 0 ? `不合格率${this.unqualifiedRate}%` : '无不合格';
    const unqualifiedItemsRemark = this.ngCount > 0 ? `不合格检验项${this.ngCount}项，` : '';
    
    let judgment = '';
    if (this.unqualifiedSamples >= re || this.ngCount > 0) {
      judgment = '判定为不合格';
    } else if (this.unqualifiedSamples <= ac) {
      judgment = '判定为合格';
    } else {
      judgment = '判定为特采';
    }

    return `${remark}${unqualifiedItemsRemark}${rate}，根据AC=${ac}/RE=${re}，${judgment}。`;
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

  getSampleNames(samples: any[], judgment: number): string {
    if (!samples || samples.length === 0) {
      return '无';
    }
    const filteredSamples = samples.filter(s => {
      if (judgment === 0 ) {
        return (s.judgment === 0 || !s.judgment) && s.sampleValue != null && s.sampleValue.trim() !== '';
      }
      return s.judgment === judgment ;
    });
    if (filteredSamples.length === 0) {
      return '无';
    }
    return filteredSamples.map(s => s.sampleName).join(', ');
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
      remark: this.completeForm.value.remark,
      qualifiedSampleCount: this.qualifiedSamples,
      unqualifiedSampleCount: this.unqualifiedSamples,
      incompleteSampleCount: this.incompleteSamples,
      unqualifiedItemCount: this.ngCount,
      qualifiedItemCount: this.okCount,
      pendingItemCount: this.pendingCount
    });
  }
}
