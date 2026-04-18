import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type { Complaint, ComplaintComment } from '../../entities/models';
import type { ComplaintStatus } from '../../enums/complaint-status.enum';
import type { Complaint8DStatus } from '../../enums/complaint8-dstatus.enum';
import type { ReminderType } from '../../enums/reminder-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ComplaintNotificationService {
  private restService = inject(RestService);
  apiName = 'Default';

  checkAndSendReminders = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/check-and-send-reminders'
      },
      { apiName: this.apiName, ...config }
    );

  send8DStageNotification = (complaint: Complaint, stage: Complaint8DStatus, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send8DStage-notification',
        params: { stage },
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendApprovalRequiredNotification = (complaint: Complaint, approverId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/complaint-notification/send-approval-required-notification/${approverId}`,
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendApprovalResultNotification = (complaint: Complaint, approverId: string, approved: boolean, comment: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/complaint-notification/send-approval-result-notification/${approverId}`,
        params: { approved, comment },
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendAssignmentNotification = (complaint: Complaint, assigneeId: string, remark?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/complaint-notification/send-assignment-notification/${assigneeId}`,
        params: { remark },
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendClosureNotification = (complaint: Complaint, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-closure-notification',
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendCommentNotification = (comment: ComplaintComment, mentionedUserIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-comment-notification',
        body: mentionedUserIds
      },
      { apiName: this.apiName, ...config }
    );

  sendDownloadReadyNotification = (userId: string, fileName: string, downloadUrl: string, expiresAt: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/complaint-notification/send-download-ready-notification/${userId}`,
        params: { fileName, downloadUrl, expiresAt }
      },
      { apiName: this.apiName, ...config }
    );

  sendEscalationNotification = (complaint: Complaint, reason: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-escalation-notification',
        params: { reason },
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendImportCompleteNotification = (userId: string, successCount: number, failCount: number, fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/complaint-notification/send-import-complete-notification/${userId}`,
        params: { successCount, failCount, fileName }
      },
      { apiName: this.apiName, ...config }
    );

  sendImportProgressNotification = (userId: string, total: number, processed: number, fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/complaint-notification/send-import-progress-notification/${userId}`,
        params: { total, processed, fileName }
      },
      { apiName: this.apiName, ...config }
    );

  sendMentionNotification = (mentionedUserId: string, content: string, complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-mention-notification',
        params: { mentionedUserId, content, complaintId }
      },
      { apiName: this.apiName, ...config }
    );

  sendNewComplaintNotification = (complaint: Complaint, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-new-complaint-notification',
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendReminderNotification = (complaint: Complaint, reminderType: ReminderType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-reminder-notification',
        params: { reminderType },
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendStatusChangeNotification = (complaint: Complaint, fromStatus: ComplaintStatus, toStatus: ComplaintStatus, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-status-change-notification',
        params: { fromStatus, toStatus },
        body: complaint
      },
      { apiName: this.apiName, ...config }
    );

  sendUploadCompleteNotification = (userId: string, fileId: string, fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-upload-complete-notification',
        params: { userId, fileId, fileName }
      },
      { apiName: this.apiName, ...config }
    );

  sendUploadProgressNotification = (userId: string, fileId: string, fileName: string, progress: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/complaint-notification/send-upload-progress-notification',
        params: { userId, fileId, fileName, progress }
      },
      { apiName: this.apiName, ...config }
    );
}
