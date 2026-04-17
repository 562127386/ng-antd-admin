import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FullTraceReport } from '../../models/complaint.model';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-complaint-traceability',
  templateUrl: './complaint-traceability.component.html',
  styleUrls: ['./complaint-traceability.component.less'],
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    NzTabsModule,
    NzTableModule,
    NzDescriptionsModule,
    NzTagModule,
    NzStatisticModule,
    NzSpinModule
  ],
  standalone: true
})
export class ComplaintTraceabilityComponent implements OnInit {
  @Input() complaintId!: string;

  report: FullTraceReport | null = null;
  loading = false;
  activeTab = 'iqc';

  constructor(
    private complaintService: ComplaintService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadTraceReport();
  }

  loadTraceReport(): void {
    this.loading = true;
    this.complaintService.getFullTraceReport(this.complaintId).subscribe({
      next: (data:any) => {
        this.report = data;
        this.loading = false;
      },
      error: () => {
        this.message.error('获取追溯数据失败');
        this.loading = false;
      }
    });
  }

  hasData(section: any): boolean {
    if (!section) return false;
    return Object.keys(section).some(key => {
      const value = (section as any)[key];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });
  }
}
