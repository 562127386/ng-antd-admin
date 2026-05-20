import { Injectable, OnDestroy } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, BehaviorSubject } from 'rxjs';
import { ComplaintNotification } from '../models/complaint.model';
import * as signalR from '@microsoft/signalr';
import { environment } from '@env/environment';

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

  private getAuthToken(): string {
    // ABP框架通常将token存储在以下key中
    const possibleKeys = [
      // ABP Angular 存储的key
      'o3r',  // ABP Angular的token key
      'access_token',
      'abp.auth.token',
      'Authorization',
      // 其他可能的key
      'ng3auth',
      'oidc_token'
    ];

    // 也尝试从sessionStorage获取
    const sessionKeys = ['Authorization', 'abp.auth.token'];

    console.log('SignalR: Searching for auth token...');

    // 先检查sessionStorage（ABP通常用这个）
    for (const key of sessionKeys) {
      const token = sessionStorage.getItem(key);
      if (token) {
        console.log('SignalR: Found token in sessionStorage with key:', key);
        return token.replace(/^Bearer\s+/i, '').trim();
      }
    }

    // 再检查localStorage
    for (const key of possibleKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        console.log('SignalR: Found token in localStorage with key:', key);
        return token.replace(/^Bearer\s+/i, '').trim();
      }
    }

    // 尝试从ABP的环境配置获取
    try {
      const abpAuth = (window as any).abp?.auth;
      if (abpAuth?.token) {
        console.log('SignalR: Found token in window.abp.auth');
        return abpAuth.token.replace(/^Bearer\s+/i, '').trim();
      }
    } catch (e) {
      console.log('SignalR: Could not access window.abp.auth');
    }

    console.warn('SignalR: No authorization token found');
    return '';
  }

  private initSignalRConnection(): void {
    try {
      const apiUrl = this.getApiUrl();
      const hubUrl = `${apiUrl}/signalr-hubs/complaint`;

      // 获取认证令牌
      const accessToken = this.getAuthToken();
      console.log('SignalR: Connecting to', hubUrl);
      console.log('SignalR: Token available:', !!accessToken, 'Length:', accessToken?.length);

      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => accessToken,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
        .configureLogging(signalR.LogLevel.Debug)
        .build();

      // 添加连接状态变化日志
      this.hubConnection.onclose((error) => {
        console.log('SignalR: Connection closed', error);
      });

      this.hubConnection.onreconnecting((error) => {
        console.log('SignalR: Reconnecting...', error);
      });

      this.hubConnection.onreconnected((connectionId) => {
        console.log('SignalR: Reconnected with ID:', connectionId);
        this.connectionEstablished.next(true);
      });

      if (this.hubConnection) {
        // 注册所有通知处理器
        this.registerNotificationHandlers();

        this.hubConnection.start()
          .then(() => {
            console.log('SignalR: Connected successfully');
            console.log('SignalR: Connection ID:', this.hubConnection?.connectionId);
            this.connectionEstablished.next(true);
          })
          .catch((err: any) => {
            console.error('SignalR: Connection failed:', err);
            this.connectionEstablished.next(false);
          });
      }
    } catch (error) {
      console.error('SignalR: Initialization failed:', error);
    }
  }

  private registerNotificationHandlers(): void {
    if (!this.hubConnection) return;

    // 通用通知处理器 - 最重要的一个
    this.hubConnection.on('ReceiveNotification', (data: any) => {
      console.log('SignalR: Received ReceiveNotification:', data);
      this.showNotification(data);
      this.notificationSubject.next(data);
    });

    // 客诉特定通知
    this.hubConnection.on('ReceiveComplaintNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received complaint notification:', data);
      this.showNotification(data);
      this.notificationSubject.next(data);
    });

    // 状态变更通知
    this.hubConnection.on('ReceiveStatusChangeNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received status change:', data);
      this.showNotification(data);
      this.notificationSubject.next(data);
    });

    // 提醒通知
    this.hubConnection.on('ReceiveReminderNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received reminder:', data);
      this.showReminder(data);
      this.notificationSubject.next(data);
    });

    // 升级通知
    this.hubConnection.on('ReceiveEscalationNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received escalation:', data);
      this.showEscalation(data);
      this.notificationSubject.next(data);
    });

    // 分配通知
    this.hubConnection.on('ReceiveAssignmentNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received assignment:', data);
      this.showNotification(data);
      this.notificationSubject.next(data);
    });

    // 审批通知
    this.hubConnection.on('ReceiveApprovalNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received approval:', data);
      this.showNotification(data);
      this.notificationSubject.next(data);
    });

    // 审批结果通知
    this.hubConnection.on('ReceiveApprovalResultNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received approval result:', data);
      this.showNotification(data);
      this.notificationSubject.next(data);
    });

    // 评论通知
    this.hubConnection.on('ReceiveCommentNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received comment:', data);
      this.showComment(data);
      this.notificationSubject.next(data);
    });

    // @提及通知
    this.hubConnection.on('ReceiveMentionNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received mention:', data);
      this.showMention(data);
      this.notificationSubject.next(data);
    });

    // 8D阶段通知
    this.hubConnection.on('Receive8DStageNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received 8D stage:', data);
      this.showNotification(data);
      this.notificationSubject.next(data);
    });

    // 结案通知
    this.hubConnection.on('ReceiveClosureNotification', (data: ComplaintNotification) => {
      console.log('SignalR: Received closure:', data);
      this.showNotification(data);
      this.notificationSubject.next(data);
    });

    // 上传进度
    this.hubConnection.on('ReceiveUploadProgress', (data: any) => {
      console.log('SignalR: Received upload progress:', data);
      this.showUploadProgress(data);
    });

    // 上传完成
    this.hubConnection.on('ReceiveUploadComplete', (data: any) => {
      console.log('SignalR: Received upload complete:', data);
      this.showUploadComplete(data);
    });

    // 下载就绪
    this.hubConnection.on('ReceiveDownloadReady', (data: any) => {
      console.log('SignalR: Received download ready:', data);
      this.showDownloadReady(data);
    });

    // 导入进度
    this.hubConnection.on('ReceiveImportProgress', (data: any) => {
      console.log('SignalR: Received import progress:', data);
      this.showImportProgress(data);
    });

    // 导入完成
    this.hubConnection.on('ReceiveImportComplete', (data: any) => {
      console.log('SignalR: Received import complete:', data);
      this.showImportComplete(data);
    });
  }

  private getApiUrl(): string {
    return environment['apiUrl'];//'https://localhost:44312';
  }

  showNotification(data: ComplaintNotification): void {
    const color = this.getColor(data.color);
    this.notification.create(data.type?.toString() || 'info', data.title || '通知', (data.message??'') +'\n'+ (data.content??'') , {
      nzPlacement:'top',
      nzDuration: 0
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
    this.notification.info(data.title || '新评论', data.message || '', { nzDuration: 0 });
  }

  showMention(data: ComplaintNotification): void {
    this.notification.info(data.title || '@提及', data.message || '', { nzDuration: 0 });
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