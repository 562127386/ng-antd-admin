import { Injectable } from '@angular/core';
import { Rest, RestService } from '@abp/ng.core';
import { Observable } from 'rxjs';
import { DrillInput, Sort } from '@app/erupt/model/erupt.model';
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
    public upload: string = "/upload/";

    public excelImport: string = "/import/";

    public static drillToHeader(drillInput: DrillInput): object {
        return {
            drill: drillInput.code,
            drillSourceErupt: drillInput.eruptParent,
            drillValue: drillInput.val
        }
    }
    //自定义按钮表单初始值
    operatorFormValue(eruptName: string, operatorCode: string, ids: any): Observable<any> {
        // return this._http.post(RestPath.data + "/" + eruptName + "/operator/" + operatorCode + "/form-value", null, {
        //     ids: ids
        // }, {
        //     observe: "body",
        //     headers: {
        //         erupt: eruptName
        //     }
        // });
        const url = `${this.getApiBaseUrl(eruptName)}/operator/${operatorCode}/form-value`;
        return this.rest.request<any, any>(
            { method: 'POST', url, body:  { ids: ids } ,
              headers: {
                      erupt: eruptName
                    }
                  },
            { apiName: 'default' }
        );
 
    }
    getEruptViewTpl(eruptName: string, fieldName: string, arg2: any) {
        throw new Error("Method not implemented.");
    }
    updateGanttDate(eruptName: string, code: string, id: any, start: any, end: any) {
        throw new Error('Method not implemented.');
    }
    static previewAttachment(arg0: string) {
        throw new Error('Method not implemented.');
    }
    addEruptData(eruptName: string, arg1: object) {
        throw new Error("Method not implemented.");
    }
    queryDependTreeData(eruptName: string) {
        throw new Error('Method not implemented.');
    }
    queryEruptDataById(eruptName: string, id: any) {
        throw new Error("Method not implemented.");
    }
    
    updateEruptData(eruptName: string, obj: object) {
        throw new Error("Method not implemented.");
    }
    getEruptOperationTpl(eruptName: string, code: string, ids: any[]) {
        throw new Error("Method not implemented.");
    }

    downloadExcelTemplate(eruptName: string) {
        throw new Error("Method not implemented.");
    }

    extraRow(eruptName: string, condition: any) {
        throw new Error("Method not implemented.");
    }
    deleteEruptDataList(entityName: string, ids: any[]) {
         const url = `${this.getApiBaseUrl(entityName)}/Delete`;
          return this.rest.request<any, any>(
            { method: 'DELETE', url, params: { ids } },
            { apiName: 'default' }
          );
    }
    queryEruptTableData(eruptName: string, url: string | null, arg2: { pageIndex: number; pageSize: number; vis: string; sort: Sort[]; }, header: object) {
        throw new Error("Method not implemented.");
    }
    //执行自定义operator方法
    execOperatorFun(eruptName: string, operatorCode: string, ids: any, param: any): Observable<any> {
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
   getEruptVisTpl(entityName: string, visCode: string) {
        // return RestPath.tpl + "/vis-tpl/" + eruptName + "/" + visCode +
        //     "?_token=" + this.tokenService.get().token + "&_lang=" + this.i18n.currentLang + "&_erupt=" + eruptName;
             const url = `/vis-tpl/${this.getApiBaseUrl(entityName)}/${visCode}}`;
        return this.rest.request<any, any>(
          { method: 'GET', url, },
          { apiName: 'default' }
        );

    }
  getEruptBuild(value: string): import("rxjs").Observable<import("../../erupt/model/erupt-build.model").EruptBuildModel> {
      throw new Error("Method not implemented.");
  }
  getEruptBuildByField(eruptName: string, fieldName: string, parentEruptName: string | undefined): import("rxjs").Observable<import("../../erupt/model/erupt-build.model").EruptBuildModel> {
      throw new Error("Method not implemented.");
  }
  private readonly apiPrefix = '/api/app/';

  constructor(private rest: RestService) {}

  private getApiBaseUrl(entityName: string): string {
    return `${this.apiPrefix}${entityName}`;
  }

  //获取初始化数据
  getInitValue(entityName: string, eruptParentName?: string, header?: object): Observable<any> {
        // return this._http.get<any>(RestPath.data + "/init-value/" + eruptName, null, {
        //     observe: "body",
        //     headers: {
        //         erupt: eruptName,
        //         eruptParent: eruptParentName || '',
        //         ...header
        //     }
        // });
        const url = `${this.getApiBaseUrl(entityName)}/init-value`;
        return this.rest.request<any, any>(
          { method: 'GET', url, },
          { apiName: 'default' }
        );
  }

  /**
   * 全部查询
   */
  GetAll88<T>(entityName: string, input: PagedRequest) {
    const url = `${this.getApiBaseUrl(entityName)}/GetAll`;
    return this.rest.request<any, any>(
      { method: 'GET', url, params: input },
      { apiName: 'default' }
    );
  }

  //下载
      downloadExcel(entityName: string, condition: QueryCondition[] | null, arg2: any, arg3: () => void) {
        const url = `${this.getApiBaseUrl(entityName)}/export-by-template-file`;
        return this.rest.request<any, any>(
          { 
            method: 'POST', url, body: condition,
            responseType: 'blob', // 核心：接收文件流
           },
          { apiName: 'default'}
        );
    }

  //   downloadExcel(entityName: string, condition: QueryCondition[] | null, arg2: any, arg3: () => void) {
  //       const url = `${this.getApiBaseUrl(entityName)}/export-by-template-file`;
  //       // 强制绕过类型检查（唯一能解决你所有报错的方案）
  // const options: any = {
  //   apiName: 'default',
  //   responseType: 'blob',
  //   observe: 'response',
  // };
  //       return this.rest.request<any, any>(
  //         { 
  //           method: 'POST', url, body: condition,
  //           responseType: 'blob', // 核心：接收文件流
  //          },
  //          options,
  //         // { apiName: 'default',
  //         //    // 关键：拿到完整响应（包括 header）
  //         //    observe: 'response'  as const, //Rest.Observe.Response,//
  //         //  }
  //       );
  //   }


// downloadExcel(
//   entityName: string,
//   condition: QueryCondition[] | null,
//   arg2: any,
//   arg3: () => void
// ) {
//   const url = `${this.getApiBaseUrl(entityName)}/export-by-template-file`;

//   return this.rest.http.post(url, condition, {
//     responseType: 'blob',
//     observe: 'response',
//   });
// }

  /**
   * 分页查询
   */
  getAll<T>(entityName: string, input: PagedRequest) {
    const url = `${this.getApiBaseUrl(entityName)}`;
    return this.rest.request<any, any>(
      { method: 'GET', url, params: input },
      { apiName: 'default' }
    );
  }

  /**
   * 获取单条
   */
  get<T>(entityName: string, id: string | number) {
    // const url = `${this.getApiBaseUrl(entityName)}/Get`;
    // return this.rest.request<any, any>(
    //   { method: 'GET', url, params: { id } },
    //   { apiName: 'default' }
    // );
    //上面请求产生的url是如下：https://localhost:44312/api/app/defect/Get?id=43fafe4f-d95e-138c-aa9f-3a1fe95db442
    //但是后端url是：https://localhost:44312/api/app/defect/43fafe4f-d95e-138c-aa9f-3a1fe95db442
    const url = `${this.getApiBaseUrl(entityName)}/${id}`;
    return this.rest.request<any, any>(
      { method: 'GET', url, },
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
   * 更新  废弃目前没用
   */
  updateEntity<T>(entityName: string, input: unknown) {
    const url = `${this.getApiBaseUrl(entityName)}/Update`;
    return this.rest.request<any, any>(
      { method: 'PUT', url, body: input },
      { apiName: 'default' }
    );
  }
/**
 * 更新（完美匹配你的后端）
 * URL 格式：/api/app/defect/{id}
 */
update<T>(entityName: string, id: string | number, input: unknown) {
  // 关键：URL 拼接成 /api/app/entity/{id}
  const url = `${this.getApiBaseUrl(entityName)}/${id}`;
  return this.rest.request<any,any>(
    { 
      method: 'PUT', 
      url: url, 
      body: input // body 不带 id
    },
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