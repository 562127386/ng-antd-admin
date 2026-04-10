import { Injectable } from '@angular/core';
import { RestService } from '@abp/ng.core';
import { Observable } from 'rxjs';
import { Sort } from '@app/erupt/model/erupt.model';
import { QueryCondition } from '@app/erupt/model/erupt.vo';

// 通用分页请求
export interface PagedRequest {
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class DataService {
    updateEruptData(eruptName: string, obj: object) {
        throw new Error("Method not implemented.");
    }
    getEruptOperationTpl(eruptName: string, code: string, ids: any[]) {
        throw new Error("Method not implemented.");
    }
    operatorFormValue(eruptName: string, code: string, ids: any[]) {
        throw new Error("Method not implemented.");
    }
    downloadExcelTemplate(eruptName: string) {
        throw new Error("Method not implemented.");
    }
    downloadExcel(eruptName: string, condition: QueryCondition[] | null, arg2: any, arg3: () => void) {
        throw new Error("Method not implemented.");
    }
    extraRow(eruptName: string, condition: any) {
        throw new Error("Method not implemented.");
    }
    deleteEruptDataList(eruptName: string, ids: any[]) {
        throw new Error("Method not implemented.");
    }
    queryEruptTableData(eruptName: string, url: string | null, arg2: { pageIndex: number; pageSize: number; vis: string; sort: Sort[]; }, header: object) {
        throw new Error("Method not implemented.");
    }
    //执行自定义operator方法
    execOperatorFun(eruptName: string, operatorCode: string, ids: any, param: object): Observable<any> {
        const url = `${this.getApiBaseUrl(eruptName+ "/operator/" + operatorCode)}/Create`;
        return this.rest.request<any, any>(
        { method: 'POST', url, body: {
                ids: ids,
                param: param
            } },
        { apiName: 'default' }
        );


        // return this._http.post(this.apiPrefix + "/" + eruptName + "/operator/" + operatorCode, {
        //     ids: ids,
        //     param: param
        // }, null, {
        //     observe: "body",
        //     headers: {
        //         erupt: eruptName
        //     }
        // });
        
    }
  getEruptBuild(value: string): import("rxjs").Observable<import("../../erupt/model/erupt-build.model").EruptBuildModel> {
      throw new Error("Method not implemented.");
  }
  getEruptBuildByField(eruptName: string, fieldName: string, parentEruptName: string | undefined): import("rxjs").Observable<import("../../erupt/model/erupt-build.model").EruptBuildModel> {
      throw new Error("Method not implemented.");
  }
  private readonly apiPrefix = '/api/services/app/';

  constructor(private rest: RestService) {}

  private getApiBaseUrl(entityName: string): string {
    return `${this.apiPrefix}${entityName}`;
  }

  /**
   * 分页查询
   */
  getAll<T>(entityName: string, input: PagedRequest) {
    const url = `${this.getApiBaseUrl(entityName)}/GetAll`;
    return this.rest.request<any, any>(
      { method: 'GET', url, params: input },
      { apiName: 'default' }
    );
  }

  /**
   * 获取单条
   */
  get<T>(entityName: string, id: string | number) {
    const url = `${this.getApiBaseUrl(entityName)}/Get`;
    return this.rest.request<any, any>(
      { method: 'GET', url, params: { id } },
      { apiName: 'default' }
    );
  }

  /**
   * 创建
   */
  create<T>(entityName: string, input: unknown) {
    const url = `${this.getApiBaseUrl(entityName)}/Create`;
    return this.rest.request<any, any>(
      { method: 'POST', url, body: input },
      { apiName: 'default' }
    );
  }

  /**
   * 更新
   */
  update<T>(entityName: string, input: unknown) {
    const url = `${this.getApiBaseUrl(entityName)}/Update`;
    return this.rest.request<any, any>(
      { method: 'PUT', url, body: input },
      { apiName: 'default' }
    );
  }

  /**
   * 删除
   */
  delete(entityName: string, id: string | number) {
    const url = `${this.getApiBaseUrl(entityName)}/Delete`;
    return this.rest.request<any, any>(
      { method: 'DELETE', url, params: { id } },
      { apiName: 'default' }
    );
  }
}