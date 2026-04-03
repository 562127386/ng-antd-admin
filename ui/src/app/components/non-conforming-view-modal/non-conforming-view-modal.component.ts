import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NonConformingDto } from '../../pages/base-data/models/non-conforming.model';
import { NonConformingStatus, ReviewResult, DefectSeverity, InspectionType, InspectionResult } from '../../pages/base-data/models/enums';

@Component({
  selector: 'app-non-conforming-view-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzDescriptionsModule,
    NzTagModule,
    NzDividerModule
  ],
  templateUrl: './non-conforming-view-modal.component.html',
  styleUrls: ['./non-conforming-view-modal.component.less']
})
export class NonConformingViewModalComponent implements OnInit {
  nonConforming!: NonConformingDto;
  private modalRef = inject(NzModalRef);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // 从nzData中获取参数
    if (this.modalRef.getConfig().nzData) {
      this.nonConforming = this.modalRef.getConfig().nzData.nonConforming;
    }
  }

  statusOptions = [
    { label: '待审核', value: NonConformingStatus.PendingReview, color: 'default' },
    { label: '审核中', value: NonConformingStatus.Reviewing, color: 'processing' },
    { label: '待处理', value: NonConformingStatus.PendingDisposal, color: 'warning' },
    { label: '处理中', value: NonConformingStatus.Disposing, color: 'processing' },
    { label: '已完成', value: NonConformingStatus.Completed, color: 'success' }
  ];

  sourceModuleOptions = [
    { label: 'IQC', value: InspectionType.IQC },
    { label: 'IPQC', value: InspectionType.IPQC },
    { label: 'FQC', value: InspectionType.FQC },
    { label: 'OQC', value: InspectionType.OQC }
  ];

  severityOptions = [
    { label: '轻微', value: DefectSeverity.Minor, color: 'default' },
    { label: '一般', value: DefectSeverity.Moderate, color: 'warning' },
    { label: '严重', value: DefectSeverity.Major, color: 'error' },
    { label: '致命', value: DefectSeverity.Critical, color: 'red' }
  ];

  reviewResultOptions = [
    { label: '返工', value: ReviewResult.Rework },
    { label: '返修', value: ReviewResult.Repair },
    { label: '让步', value: ReviewResult.Concession },
    { label: '报废', value: ReviewResult.Scrap }
  ];

  inspectionResultOptions = [
    { label: '合格', value: InspectionResult.Accepted },
    { label: '不合格', value: InspectionResult.Rejected },
    { label: '特采', value: InspectionResult.Concession },
    { label: '挑选', value: InspectionResult.Sorting, color: 'processing' }
  ];

  ngOnInit(): void {
  }

  getStatusText(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : '';
  }

  getStatusColor(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.color : 'default';
  }

  getSourceModuleText(source: number): string {
    const option = this.sourceModuleOptions.find(o => o.value === source);
    return option ? option.label : '';
  }

  getSeverityText(severity: number): string {
    const option = this.severityOptions.find(o => o.value === severity);
    return option ? option.label : '';
  }

  getSeverityColor(severity: number): string {
    const option = this.severityOptions.find(o => o.value === severity);
    return option ? option.color : 'default';
  }

  getReviewResultText(result?: number): string {
    if (result === undefined || result === null) return '-';
    const option = this.reviewResultOptions.find(o => o.value === result);
    return option ? option.label : '-';
  }

  getInspectionResultText(result?: number): string {
    if (result === undefined || result === null) return '-';
    const option = this.inspectionResultOptions.find(o => o.value === result);
    return option ? option.label : '-';
  }

  handleCancel(): void {
    this.modalRef.destroy();
  }

  handleOk(): void {
    this.modalRef.destroy();
  }
}
