import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';
import { COMPLAINT_8D_STATUS_NAMES } from '../../models/enums';
import { Complaint8D } from '../../models/complaint.model';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-complaint-8d',
  templateUrl: './complaint-8d.component.html',
  styleUrls: ['./complaint-8d.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzStepsModule,
    NzDescriptionsModule,
    NzTimelineModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule,
    NzDividerModule,
    NzAlertModule,
    NzIconModule,
    NzModalModule,
    NzUploadModule,
    NzFormModule
  ],
  standalone: true
})
export class Complaint8DComponent implements OnInit {
  @Input() complaintId!: string;

  complaint8D: Complaint8D | null = null;
  loading = false;

  isD1ModalVisible = false;
  isD2ModalVisible = false;
  isD3ModalVisible = false;
  isD4ModalVisible = false;
  isD5ModalVisible = false;
  isD6ModalVisible = false;
  isD7ModalVisible = false;
  isD8ModalVisible = false;

  d1Form: FormGroup;
  d2Form: FormGroup;
  d3Form: FormGroup;
  d4Form: FormGroup;
  d5Form: FormGroup;
  d6Form: FormGroup;
  d7Form: FormGroup;
  d8Form: FormGroup;

  currentStep = 0;
  eightDStatusNames = COMPLAINT_8D_STATUS_NAMES;

  constructor(
    private complaintService: ComplaintService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.d1Form = this.fb.group({ teamMembers: [''] });
    this.d2Form = this.fb.group({ problemDetails: [''], photos: [''] });
    this.d3Form = this.fb.group({ containmentAction: [''], verificationResult: [''] });
    this.d4Form = this.fb.group({ rootCauses: [''], analysisTools: [''] });
    this.d5Form = this.fb.group({ correctiveActions: [''] });
    this.d6Form = this.fb.group({ implementationTrack: [''] });
    this.d7Form = this.fb.group({ standardization: [''] });
    this.d8Form = this.fb.group({ conclusion: [''], customerConfirmation: [false] });
  }

  ngOnInit(): void {
    this.load8D();
  }

  load8D(): void {
    this.loading = true;
    this.complaintService.get8D(this.complaintId).subscribe({
      next: (data:any) => {
        this.complaint8D = data;
        this.currentStep = data.status || 0;
        this.loading = false;
      },
      error: () => {
        this.message.error('获取8D报告失败');
        this.loading = false;
      }
    });
  }

  openD1Modal(): void { this.isD1ModalVisible = true; }
  openD2Modal(): void { this.isD2ModalVisible = true; }
  openD3Modal(): void { this.isD3ModalVisible = true; }
  openD4Modal(): void { this.isD4ModalVisible = true; }
  openD5Modal(): void { this.isD5ModalVisible = true; }
  openD6Modal(): void { this.isD6ModalVisible = true; }
  openD7Modal(): void { this.isD7ModalVisible = true; }
  openD8Modal(): void { this.isD8ModalVisible = true; }

  closeD1Modal(): void { this.isD1ModalVisible = false; }
  closeD2Modal(): void { this.isD2ModalVisible = false; }
  closeD3Modal(): void { this.isD3ModalVisible = false; }
  closeD4Modal(): void { this.isD4ModalVisible = false; }
  closeD5Modal(): void { this.isD5ModalVisible = false; }
  closeD6Modal(): void { this.isD6ModalVisible = false; }
  closeD7Modal(): void { this.isD7ModalVisible = false; }
  closeD8Modal(): void { this.isD8ModalVisible = false; }

  saveD1(): void {
    this.complaintService.updateD1(this.complaintId, this.d1Form.value).subscribe({
      next: () => {
        this.message.success('D1保存成功');
        this.load8D();
        this.closeD1Modal();
      },
      error: () => this.message.error('D1保存失败')
    });
  }

  saveD2(): void {
    this.complaintService.updateD2(this.complaintId, this.d2Form.value).subscribe({
      next: () => {
        this.message.success('D2保存成功');
        this.load8D();
        this.closeD2Modal();
      },
      error: () => this.message.error('D2保存失败')
    });
  }

  saveD3(): void {
    this.complaintService.updateD3(this.complaintId, this.d3Form.value).subscribe({
      next: () => {
        this.message.success('D3保存成功');
        this.load8D();
        this.closeD3Modal();
      },
      error: () => this.message.error('D3保存失败')
    });
  }

  saveD4(): void {
    this.complaintService.updateD4(this.complaintId, this.d4Form.value).subscribe({
      next: () => {
        this.message.success('D4保存成功');
        this.load8D();
        this.closeD4Modal();
      },
      error: () => this.message.error('D4保存失败')
    });
  }

  saveD5(): void {
    this.complaintService.updateD5(this.complaintId, this.d5Form.value).subscribe({
      next: () => {
        this.message.success('D5保存成功');
        this.load8D();
        this.closeD5Modal();
      },
      error: () => this.message.error('D5保存失败')
    });
  }

  saveD6(): void {
    this.complaintService.updateD6(this.complaintId, this.d6Form.value).subscribe({
      next: () => {
        this.message.success('D6保存成功');
        this.load8D();
        this.closeD6Modal();
      },
      error: () => this.message.error('D6保存失败')
    });
  }

  saveD7(): void {
    this.complaintService.updateD7(this.complaintId, this.d7Form.value).subscribe({
      next: () => {
        this.message.success('D7保存成功');
        this.load8D();
        this.closeD7Modal();
      },
      error: () => this.message.error('D7保存失败')
    });
  }

  saveD8(): void {
    this.complaintService.completeD8(this.complaintId, this.d8Form.value).subscribe({
      next: () => {
        this.message.success('8D报告完成');
        this.load8D();
        this.closeD8Modal();
      },
      error: () => this.message.error('8D完成失败')
    });
  }

  getStepStatus(stepIndex: number): 'wait' | 'process' | 'finish' | 'error' {
    if (this.currentStep === undefined || this.currentStep === null) return 'wait';
    if (stepIndex < this.currentStep) return 'finish';
    if (stepIndex === this.currentStep) return 'process';
    return 'wait';
  }
}
