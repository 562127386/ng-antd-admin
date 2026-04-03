import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { TokenKey } from '@config/constant';
import { WindowService } from '@core/services/common/window.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

interface CustomHttpConfig {
  headers?: HttpHeaders;
}

interface ABPErrorResponse {
  error?: {
    code?: string | null;
    message?: string;
    details?: string | null;
    data?: Record<string, any>;
    validationErrors?: Array<{
      message?: string;
      members?: string[];
    }> | null;
  };
}

function parseABPError(error: HttpErrorResponse): { message: string; details?: string; validationErrors?: any[] } {
  const result = {
    message: '',
    details: '',
    validationErrors: [] as any[]
  };

  try {
    if (error.error && typeof error.error === 'object') {
      const abpError = error.error as ABPErrorResponse;
      if (abpError.error) {
        result.message = abpError.error.message || '';
        result.details = abpError.error.details || '';
        result.validationErrors = abpError.error.validationErrors || [];
      }
    }
  } catch (e) {
    console.error('解析ABP错误失败:', e);
  }

  return result;
}

export const httpInterceptorService: HttpInterceptorFn = (req, next) => {
  const windowServe = inject(WindowService);
  const messageService = inject(NzMessageService);
  const modalService = inject(NzModalService);
  const token = windowServe.getSessionStorage(TokenKey);
  let httpConfig: CustomHttpConfig = {};
  if (token) {
    httpConfig = { headers: req.headers.set(TokenKey, token) };
  }
  const copyReq = req.clone(httpConfig);

  return next(copyReq).pipe(
    filter(e => e.type !== 0),
    catchError((error: HttpErrorResponse) => {
      const status = error.status;
      const abpError = parseABPError(error);
      const abpMessage = abpError.message || abpError.details;

      if (abpMessage) {
        messageService.error(abpMessage);
        return throwError(() => ({ code: status, message: abpMessage }));
      }

      if (status === 400) {
        if (abpError.validationErrors && abpError.validationErrors.length > 0) {
          const errorList = abpError.validationErrors
            .map((err, index) => `${index + 1}. ${err.message}${err.members ? ` (${err.members.join(', ')})` : ''}`)
            .join('\n');

          modalService.error({
            nzTitle: '验证失败',
            nzContent: `
              <div style="max-height: 300px; overflow-y: auto;">
                <p style="margin-bottom: 8px;">${'请检查以下输入：'}</p>
                <pre style="white-space: pre-wrap; font-size: 12px; color: #ff4d4f;">${errorList}</pre>
              </div>
            `,
            nzOkText: '确定'
          });
          return throwError(() => ({ code: status, message: '验证失败' }));
        }
        messageService.error('请求参数有误，请检查输入');
        return throwError(() => ({ code: status, message: '验证失败' }));
      }

      if (status === 401) {
        messageService.error('登录已过期，请重新登录');
        return throwError(() => ({ code: status, message: '未授权' }));
      }

      if (status === 403) {
        messageService.error('您没有权限执行此操作');
        return throwError(() => ({ code: status, message: '无权限' }));
      }

      if (status === 404) {
        messageService.error('请求的资源不存在');
        return throwError(() => ({ code: status, message: '资源不存在' }));
      }

      if (status === 0) {
        messageService.error('网络连接失败，请检查您的网络');
        return throwError(() => ({ code: status, message: '网络错误' }));
      }

      if (status >= 500) {
        messageService.error('服务器发生错误，请稍后重试');
        return throwError(() => ({ code: status, message: '服务器错误' }));
      }

      if (status >= 400 && status < 500) {
        messageService.error(`客户端错误，状态码：${status}`);
        return throwError(() => ({ code: status, message: '客户端错误' }));
      }

      if (status >= 300 && status < 400) {
        return throwError(() => ({ code: status, message: '请求被重定向' }));
      }

      return throwError(() => ({ code: status, message: '未知错误' }));
    })
  );
};
