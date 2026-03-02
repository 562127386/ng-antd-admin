import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { localUrl } from '@env/environment.prod';
import { TokenKey, TokenPre } from '@config/constant';
import { WindowService } from '@core/services/common/window.service';
import * as qs from 'qs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface HttpCustomConfig {
  needSuccessInfo?: boolean;
  showLoading?: boolean;
  otherUrl?: boolean;
  loadingText?: string;
  isAbpApi?: boolean;
}

export interface ActionResult<T> {
  code: number;
  msg: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  uri: string;
  http = inject(HttpClient);
  message = inject(NzMessageService);
  windowServe = inject(WindowService);

  protected constructor() {
    this.uri = environment.production ? localUrl : '/site/api';
  }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.windowServe.getSessionStorage(TokenKey);
    if (token) {
      headers = headers.set('Authorization', token);
    }
    return headers;
  }

  get<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false, isAbpApi: false };
    const reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });

    const closeLoading = this.handleLoading(config);
    const headers = this.getAuthHeaders();

    if (config.isAbpApi) {
      return this.http.get<T>(reqPath, { params, headers }).pipe(
        finalize(closeLoading)
      );
    }

    return this.http.get<ActionResult<T>>(reqPath, { params, headers }).pipe(
      finalize(closeLoading),
      this.resultHandle<T>(config)
    );
  }

  delete<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false, isAbpApi: false };
    const reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });

    const closeLoading = this.handleLoading(config);
    const headers = this.getAuthHeaders();

    if (config.isAbpApi) {
      return this.http.delete<T>(reqPath, { params, headers }).pipe(
        finalize(closeLoading)
      );
    }

    return this.http.delete<ActionResult<T>>(reqPath, { params, headers }).pipe(
      finalize(closeLoading),
      this.resultHandle<T>(config)
    );
  }

  post<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false, isAbpApi: false };
    const reqPath = this.getUrl(path, config);

    const closeLoading = this.handleLoading(config);
    const headers = this.getAuthHeaders();

    if (config.isAbpApi) {
      return this.http.post<T>(reqPath, param, { headers }).pipe(
        finalize(closeLoading)
      );
    }

    return this.http.post<ActionResult<T>>(reqPath, param, { headers }).pipe(
      finalize(closeLoading),
      this.resultHandle<T>(config)
    );
  }

  put<T>(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<T> {
    config = config || { needSuccessInfo: false, isAbpApi: false };
    const reqPath = this.getUrl(path, config);

    const closeLoading = this.handleLoading(config);
    const headers = this.getAuthHeaders();

    if (config.isAbpApi) {
      return this.http.put<T>(reqPath, param, { headers }).pipe(
        finalize(closeLoading)
      );
    }

    return this.http.put<ActionResult<T>>(reqPath, param, { headers }).pipe(
      finalize(closeLoading),
      this.resultHandle<T>(config)
    );
  }

  downLoadWithBlob(path: string, param?: NzSafeAny, config?: HttpCustomConfig): Observable<NzSafeAny> {
    config = config || { needSuccessInfo: false, isAbpApi: false };
    const reqPath = this.getUrl(path, config);

    const closeLoading = this.handleLoading(config);
    const headers = this.getAuthHeaders();

    return this.http
      .post(reqPath, param, {
        responseType: 'blob',
        headers: headers.append('Content-Type', 'application/json')
      })
      .pipe(finalize(closeLoading));
  }

  getUrl(path: string, config: HttpCustomConfig): string {
    if (config.isAbpApi) {
      return path.startsWith('/') ? path : '/' + path;
    }
    let reqPath = this.uri + path;
    if (config.otherUrl) {
      reqPath = path;
    }
    return reqPath;
  }

  private handleLoading(config: HttpCustomConfig): () => void {
    if (config.showLoading) {
      const startTime = Date.now();
      const msgRef = this.message.loading(config.loadingText || '加载中...', { nzDuration: 0 });

      return () => {
        const elapsed = Date.now() - startTime;
        const minDuration = 500;
        const remaining = minDuration - elapsed;

        if (remaining > 0) {
          setTimeout(() => {
            this.message.remove(msgRef.messageId);
          }, remaining);
        } else {
          this.message.remove(msgRef.messageId);
        }
      };
    }
    return () => {};
  }

  resultHandle<T>(config: HttpCustomConfig): (observable: Observable<ActionResult<T>>) => Observable<T> {
    return (observable: Observable<ActionResult<T>>) => {
      return observable.pipe(
        filter(item => {
          return this.handleFilter(item, !!config.needSuccessInfo);
        }),
        map(item => {
          if (![200, 201].includes(item.code)) {
            throw new Error(item.msg);
          }
          return item.data;
        })
      );
    };
  }

  handleFilter<T>(item: ActionResult<T>, needSuccessInfo: boolean): boolean {
    if (![200, 201].includes(item.code)) {
      this.message.error(item.msg);
    } else if (needSuccessInfo) {
      this.message.success('操作成功');
    }
    return true;
  }
}
