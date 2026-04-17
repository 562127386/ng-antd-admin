import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ComplaintStatusLog } from '../../models/complaint.model';
import { ComplaintService } from '../../services/complaint.service';
import { COMPLAINT_STATUS_NAMES } from '../../models/enums';

@Component({
  selector: 'app-complaint-history',
  templateUrl: './complaint-history.component.html',
  styleUrls: ['./complaint-history.component.less'],
  imports: [CommonModule, NzTimelineModule, NzTagModule],
  standalone: true
})
export class ComplaintHistoryComponent implements OnInit {
  @Input() complaintId!: string;

  statusLogs: ComplaintStatusLog[] = [];
  loading = false;
  statusNames = COMPLAINT_STATUS_NAMES;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.complaintService.getStatusLogs(this.complaintId).subscribe({
      next: (result:any) => {
        this.statusLogs = result.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
