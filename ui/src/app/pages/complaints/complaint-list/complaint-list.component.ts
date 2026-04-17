import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Complaint8DComponent } from '../components/complaint-8d/complaint-8d.component';
import { ComplaintHistoryComponent } from '../components/complaint-history/complaint-history.component';
import { ComplaintCommentsComponent } from '../components/complaint-comments/complaint-comments.component';
import { ComplaintCostsComponent } from '../components/complaint-costs/complaint-costs.component';
import { ComplaintAttachmentsComponent } from '../components/complaint-attachments/complaint-attachments.component';
import { ComplaintTraceabilityComponent } from '../components/complaint-traceability/complaint-traceability.component';
import {
  Complaint,
  ComplaintStatusLog,
  SeverityLevel,
  ComplaintDashboard,
  GetComplaintList
} from '../models/complaint.model';
import {
  SEVERITY_LEVEL_NAMES,
  COMPLAINT_STATUS_NAMES,
  ComplaintStatus
} from '../models/enums';
import { ComplaintService } from '../services/complaint.service';
import { ComplaintNotificationService } from '../services/complaint-notification.service';

@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSpaceModule,
    NzGridModule,
    NzDrawerModule,
    NzDescriptionsModule,
    NzTabsModule,
    NzTransferModule,
    NzDropDownModule,
    NzBadgeModule,
    NzProgressModule,
    NzAlertModule,
    NzStatisticModule,
    NzIconModule,
    NzTooltipModule,
    Complaint8DComponent,
    ComplaintHistoryComponent,
    ComplaintCommentsComponent,
    ComplaintCostsComponent,
    ComplaintAttachmentsComponent,
    ComplaintTraceabilityComponent
  ],
  standalone: true
})
export class ComplaintListComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = false;
  totalCount = 0;
  pageIndex = 1;
  pageSize = 20;

  searchForm: FormGroup;
  complaintForm: FormGroup;
  isModalVisible = false;
  modalTitle = '新增客诉';
  editingComplaintId: string | null = null;

  selectedComplaint: Complaint | null = null;
  isDrawerVisible = false;
  drawerTitle = '客诉详情';

  // 状态更新相关
  isStatusUpdateModalVisible = false;
  statusUpdateForm: FormGroup;

  // 客诉分配相关
  isAssignModalVisible = false;
  assignForm: FormGroup;

  dashboard: ComplaintDashboard | null = null;
  isDashboardLoading = false;

  severityOptions = Object.entries(SEVERITY_LEVEL_NAMES).map(([value, label]) => ({ value: Number(value), label }));
  statusOptions = Object.entries(COMPLAINT_STATUS_NAMES).map(([value, label]) => ({ value: Number(value), label }));

  severityLevelNames = SEVERITY_LEVEL_NAMES;
  complaintStatusNames = COMPLAINT_STATUS_NAMES;

  constructor(
    private complaintService: ComplaintService,
    private notificationService: ComplaintNotificationService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      filter: [''],
      complaintNo: [''],
      severityLevel: [null],
      status: [null],
      productBatch: [''],
      occurrenceDateFrom: [null],
      occurrenceDateTo: [null]
    });
    this.complaintForm = this.fb.group({
      customerName: ['', Validators.required],
      productCode: ['', Validators.required],
      productName: [''],
      productBatch: [''],
      problemDescription: ['', Validators.required],
      severityLevel: [null, Validators.required],
      remark: ['']
    });
    // 状态更新表单
    this.statusUpdateForm = this.fb.group({
      newStatus: [null, Validators.required],
      remark: ['']
    });
    // 客诉分配表单
    this.assignForm = this.fb.group({
      assigneeId: ['', Validators.required],
      assigneeName: ['', Validators.required],
      team: [''],
      remark: ['']
    });
  }

  ngOnInit(): void {
    this.getComplaints();
    this.getDashboard();
    this.setupNotificationSubscription();
  }

  private setupNotificationSubscription(): void {
    this.notificationService.notifications$.subscribe(notification => {
      if (notification.complaintId) {
        const index = this.complaints.findIndex(c => c.id === notification.complaintId);
        if (index >= 0) {
          this.getComplaints();
        }
      }
    });
  }

  getComplaints(): void {
    this.loading = true;
    const params: GetComplaintList = {
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize,
      ...this.searchForm.value
    };

    this.complaintService.getComplaints(params).subscribe({
      next: (result) => {
        this.complaints = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message.error('获取客诉列表失败');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getDashboard(): void {
    this.isDashboardLoading = true;
    this.complaintService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.isDashboardLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isDashboardLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  search(): void {
    this.pageIndex = 1;
    this.getComplaints();
  }

  reset(): void {
    this.searchForm.reset({
      filter: '',
      complaintNo: '',
      severityLevel: null,
      status: null,
      productBatch: '',
      occurrenceDateFrom: null,
      occurrenceDateTo: null
    });
    this.pageIndex = 1;
    this.getComplaints();
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getComplaints();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.getComplaints();
  }

  openCreateModal(): void {
    this.editingComplaintId = null;
    this.modalTitle = '新增客诉';
    this.complaintForm.reset({
      customerName: '',
      productCode: '',
      productName: '',
      productBatch: '',
      problemDescription: '',
      severityLevel: null,
      remark: ''
    });
    this.isModalVisible = true;
  }

  openEditModal(complaint: Complaint): void {
    this.editingComplaintId = complaint.id || null;
    this.modalTitle = '编辑客诉';
    this.complaintForm.patchValue({
      customerName: complaint.customerName,
      productCode: complaint.productCode,
      productName: complaint.productName || '',
      productBatch: complaint.productBatch || '',
      problemDescription: complaint.problemDescription,
      severityLevel: complaint.severityLevel
    });
    this.isModalVisible = true;
  }

  openDetailDrawer(complaint: Complaint): void {
    this.selectedComplaint = complaint;
    this.drawerTitle = `客诉详情 - ${complaint.complaintNo}`;
    this.isDrawerVisible = true;
    this.notificationService.subscribeToComplaint(complaint.id!);
  }

  closeDrawer(): void {
    if (this.selectedComplaint?.id) {
      this.notificationService.unsubscribeFromComplaint(this.selectedComplaint.id);
    }
    this.isDrawerVisible = false;
    this.selectedComplaint = null;
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  handleModalOk(): void {
    if (this.complaintForm.invalid) {
      this.message.warning('请填写必填字段');
      return;
    }

    const complaintData = this.complaintForm.value;

    if (this.editingComplaintId) {
      this.complaintService.updateComplaint(this.editingComplaintId, complaintData).subscribe({
        next: () => {
          this.message.success('更新成功');
          this.isModalVisible = false;
          this.getComplaints();
          this.getDashboard();
        },
        error: () => {
          this.message.error('更新失败');
        }
      });
    } else {
      this.complaintService.createComplaint(complaintData).subscribe({
        next: () => {
          this.message.success('创建成功');
          this.isModalVisible = false;
          this.getComplaints();
          this.getDashboard();
        },
        error: () => {
          this.message.error('创建失败');
        }
      });
    }
  }

  deleteComplaint(complaint: Complaint): void {
    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: `确定要删除客诉 ${complaint.complaintNo} 吗？`,
      nzOkText: '确认',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.complaintService.deleteComplaint(complaint.id!).subscribe({
          next: () => {
            this.message.success('删除成功');
            this.getComplaints();
            this.getDashboard();
          },
          error: () => {
            this.message.error('删除失败');
          }
        });
      }
    });
  }

  getSeverityTagColor(level: SeverityLevel): string {
    const colors: Record<SeverityLevel, string> = {
      [SeverityLevel.Fatal]: 'red',
      [SeverityLevel.Severe]: 'orange',
      [SeverityLevel.Normal]: 'blue',
      [SeverityLevel.Minor]: 'green'
    };
    return colors[level] || 'default';
  }

  getStatusTagColor(status: ComplaintStatus): string {
    const colors: Record<ComplaintStatus, string> = {
      [ComplaintStatus.Pending]: 'default',
      [ComplaintStatus.PendingResponse]: 'warning',
      [ComplaintStatus.QuickResponse]: 'processing',
      [ComplaintStatus.RootCauseAnalysis]: 'processing',
      [ComplaintStatus.PendingApproval]: 'warning',
      [ComplaintStatus.PendingCustomerConfirm]: 'warning',
      [ComplaintStatus.Closed]: 'success',
      [ComplaintStatus.Archived]: 'default'
    };
    return colors[status] || 'default';
  }

  isOverdue(complaint: Complaint): boolean {
    if (complaint.status === ComplaintStatus.Closed || complaint.status === ComplaintStatus.Archived) {
      return false;
    }
    if (complaint.resolutionDueTime) {
      return new Date(complaint.resolutionDueTime) < new Date();
    }
    return false;
  }

  trackByComplaintId(index: number, complaint: Complaint): string {
    return complaint.id || index.toString();
  }

  // 状态更新相关方法
  openStatusUpdateModal(): void {
    if (this.selectedComplaint) {
      this.statusUpdateForm.reset({
        newStatus: this.selectedComplaint.status,
        remark: ''
      });
      this.isStatusUpdateModalVisible = true;
    }
  }

  handleStatusUpdateCancel(): void {
    this.isStatusUpdateModalVisible = false;
  }

  handleStatusUpdateOk(): void {
    if (this.statusUpdateForm.invalid) {
      this.message.warning('请填写必填字段');
      return;
    }

    if (!this.selectedComplaint?.id) {
      this.message.error('客诉信息不存在');
      return;
    }

    const statusUpdateData = this.statusUpdateForm.value;

    this.complaintService.updateStatus(this.selectedComplaint.id, statusUpdateData).subscribe({
      next: () => {
        this.message.success('状态更新成功');
        this.isStatusUpdateModalVisible = false;
        this.getComplaints();
        this.getDashboard();
      },
      error: () => {
        this.message.error('状态更新失败');
      }
    });
  }

  // 客诉分配相关方法
  openAssignModal(): void {
    if (this.selectedComplaint) {
      this.assignForm.reset({
        assigneeId: '',
        assigneeName: '',
        team: '',
        remark: ''
      });
      this.isAssignModalVisible = true;
    }
  }

  handleAssignCancel(): void {
    this.isAssignModalVisible = false;
  }

  handleAssignOk(): void {
    if (this.assignForm.invalid) {
      this.message.warning('请填写必填字段');
      return;
    }

    if (!this.selectedComplaint?.id) {
      this.message.error('客诉信息不存在');
      return;
    }

    const assignData = this.assignForm.value;

    this.complaintService.assignComplaint(this.selectedComplaint.id, assignData).subscribe({
      next: () => {
        this.message.success('客诉分配成功');
        this.isAssignModalVisible = false;
        this.getComplaints();
        this.getDashboard();
      },
      error: () => {
        this.message.error('客诉分配失败');
      }
    });
  }
}
