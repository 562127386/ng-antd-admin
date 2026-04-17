import { Injectable, OnDestroy } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, BehaviorSubject } from 'rxjs';
import { ComplaintNotification } from '../models/complaint.model';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ComplaintNotificationService implements OnDestroy {
  private connectionEstablished = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionEstablished.asObservable();

  private notificationSubject = new Subject<ComplaintNotification>();
  public notifications$ = this.notificationSubject.asObservable();

  private uploadProgressMap = new Map<string, number>();
  private hubConnection: signalR.HubConnection | null = null;

  constructor(private notification: NzNotificationService) {
    this.initSignalRConnection();
  }

  private initSignalRConnection(): void {
    try {
      const apiUrl = this.getApiUrl();
      //const hubUrl = `${apiUrl}/hubs/complaint`;
const hubUrl = `${apiUrl}/signalr-hubs/complaint`;
      // // 获取认证令牌
      // const token = sessionStorage.getItem('Authorization');
      // // 移除Bearer前缀
      // const accessToken = token ? token.replace('Bearer ', '') : '';
      // this.hubConnection = new signalR.HubConnectionBuilder()
      //   .withUrl(hubUrl, {
      //     accessTokenFactory: () => accessToken
      //   })
      //   .withAutomaticReconnect()
      //   .build();

       this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();



      if (this.hubConnection) {
        this.hubConnection.on('ReceiveComplaintNotification', (data: ComplaintNotification) => {
          this.showNotification(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveStatusChangeNotification', (data: ComplaintNotification) => {
          this.showNotification(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveReminderNotification', (data: ComplaintNotification) => {
          this.showReminder(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveEscalationNotification', (data: ComplaintNotification) => {
          this.showEscalation(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveAssignmentNotification', (data: ComplaintNotification) => {
          this.showNotification(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveApprovalNotification', (data: ComplaintNotification) => {
          this.showNotification(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveApprovalResultNotification', (data: ComplaintNotification) => {
          this.showNotification(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveCommentNotification', (data: ComplaintNotification) => {
          this.showComment(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveMentionNotification', (data: ComplaintNotification) => {
          this.showMention(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('Receive8DStageNotification', (data: ComplaintNotification) => {
          this.showNotification(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveClosureNotification', (data: ComplaintNotification) => {
          this.showNotification(data);
          this.notificationSubject.next(data);
        });

        this.hubConnection.on('ReceiveUploadProgress', (data: any) => {
          this.showUploadProgress(data);
        });

        this.hubConnection.on('ReceiveUploadComplete', (data: any) => {
          this.showUploadComplete(data);
        });

        this.hubConnection.on('ReceiveDownloadReady', (data: any) => {
          this.showDownloadReady(data);
        });

        this.hubConnection.on('ReceiveImportProgress', (data: any) => {
          this.showImportProgress(data);
        });

        this.hubConnection.on('ReceiveImportComplete', (data: any) => {
          this.showImportComplete(data);
        });

        this.hubConnection.start()
          .then(() => {
            console.log('Complaint SignalR connected');
            this.connectionEstablished.next(true);
          })
          .catch((err: any) => {
            console.error('Complaint SignalR connection failed:', err);
            this.connectionEstablished.next(false);
          });
      }
    } catch (error) {
      console.error('Failed to initialize Complaint notification:', error);
    }
  }

  private getApiUrl(): string {
    // 使用ABP框架配置的API URL
    return 'https://localhost:44312'; // 后端API服务器地址
  }

  showNotification(data: ComplaintNotification): void {
    const color = this.getColor(data.color);
    this.notification.create(data.type?.toString() || 'info', data.title || '通知', data.message || '', {
      nzDuration: 5000,
      nzStyle: { backgroundColor: color }
    });
  }

  showReminder(data: ComplaintNotification): void {
    this.notification.warning(data.title || '提醒', data.message || '', { nzDuration: 0 });
    this.playSound('reminder');
  }

  showEscalation(data: ComplaintNotification): void {
    this.notification.error(data.title || '升级通知', data.message || '', { nzDuration: 0 });
    this.playSound('escalation');
  }

  showComment(data: ComplaintNotification): void {
    this.notification.info(data.title || '新评论', data.message || '', { nzDuration: 5000 });
  }

  showMention(data: ComplaintNotification): void {
    this.notification.info(data.title || '@提及', data.message || '', { nzDuration: 5000 });
  }

  showUploadProgress(data: any): void {
    this.uploadProgressMap.set(data.fileId, data.progress);
  }

  showUploadComplete(data: any): void {
    this.uploadProgressMap.delete(data.fileId);
    this.notification.success('上传完成', `文件 ${data.fileName} 已上传完成`);
  }

  showDownloadReady(data: any): void {
    this.notification.success('下载就绪', `文件 ${data.fileName} 已准备好下载`);
    if (data.downloadUrl) {
      window.open(data.downloadUrl, '_blank');
    }
  }

  showImportProgress(data: any): void {
    this.uploadProgressMap.set(`import-${data.fileName}`, data.progress);
  }

  showImportComplete(data: any): void {
    this.uploadProgressMap.delete(`import-${data.fileName}`);
    if (data.failCount > 0) {
      this.notification.warning('导入完成', `成功 ${data.successCount} 条，失败 ${data.failCount} 条`);
    } else {
      this.notification.success('导入成功', `成功导入 ${data.successCount} 条`);
    }
  }

  private getColor(colorName?: string): string {
    const colors: Record<string, string> = {
      'blue': '#1890ff',
      'green': '#52c41a',
      'red': '#ff4d4f',
      'orange': '#faad14',
      'purple': '#722ed1',
      'geekblue': '#13c2c2',
      'cyan': '#08979c'
    };
    return colors[colorName || 'blue'] || '#1890ff';
  }

  private playSound(type: string): void {
    try {
      const audio = new Audio(`/assets/sounds/${type}.mp3`);
      audio.play().catch(() => {});
    } catch {}
  }

  subscribeToComplaint(complaintId: string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SubscribeToComplaint', complaintId).catch((err: any) => {
        console.error('Failed to subscribe to complaint:', err);
      });
    } else {
      console.warn('SignalR not connected, cannot subscribe to complaint');
    }
  }

  unsubscribeFromComplaint(complaintId: string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('UnsubscribeFromComplaint', complaintId).catch((err: any) => {
        console.error('Failed to unsubscribe from complaint:', err);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((err: any) => {
        console.error('Failed to stop SignalR connection:', err);
      });
    }
  }
}
