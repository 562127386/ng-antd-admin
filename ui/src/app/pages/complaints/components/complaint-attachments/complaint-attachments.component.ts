import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ComplaintAttachment } from '../../models/complaint.model';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-complaint-attachments',
  templateUrl: './complaint-attachments.component.html',
  styleUrls: ['./complaint-attachments.component.less'],
  imports: [CommonModule, NzButtonModule, NzTableModule, NzUploadModule, NzIconModule, NzTagModule],
  standalone: true
})
export class ComplaintAttachmentsComponent implements OnInit {
  @Input() complaintId!: string;

  attachments: ComplaintAttachment[] = [];
  loading = false;

  constructor(
    private complaintService: ComplaintService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadAttachments();
  }

  loadAttachments(): void {
    this.loading = true;
    this.complaintService.getAttachments(this.complaintId).subscribe({
      next: (result:any) => {
        this.attachments = result.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  handleUpload = (file: NzUploadFile): boolean => {
    this.complaintService.uploadAttachment(this.complaintId, file as any).subscribe({
      next: () => {
        this.message.success('上传成功');
        this.loadAttachments();
      },
      error: () => {
        this.message.error('上传失败');
      }
    });
    return false;
  };

  downloadAttachment(attachment: ComplaintAttachment): void {
    if (attachment.filePath) {
      window.open(attachment.filePath, '_blank');
    }
  }

  deleteAttachment(attachmentId: string): void {
    this.complaintService.deleteAttachment(this.complaintId, attachmentId).subscribe({
      next: () => {
        this.message.success('删除成功');
        this.loadAttachments();
      },
      error: () => {
        this.message.error('删除失败');
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
