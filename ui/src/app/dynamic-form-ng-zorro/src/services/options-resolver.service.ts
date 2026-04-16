import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormFieldConfig, OptionProps } from '../models';
import { RestService } from '@abp/ng.core';

@Injectable({ providedIn: 'root' })
export class OptionsResolverService {
  private restService = inject(RestService);

  resolveOptions(field: FormFieldConfig): Observable<any[]> {
    const options = field.options;
    if (!options) return of([]);

    if (options.url) {
      return this.restService.request<any, any[]>(
        { method: 'GET', url: options.url },
        { apiName: options.apiName }
      ).pipe(
        map(data => this.mapOptions(data, options))
      );
    }

    if (options.defaultValues?.length) {
      return of(this.mapOptions(options.defaultValues, options));
    }

    return of([]);
  }

  private mapOptions(data: any[], options: OptionProps): any[] {
    const labelProp = options.labelProp || 'value';
    const valueProp = options.valueProp || 'key';
    return data.map(item => ({
      key: item[valueProp] ?? item,
      value: item[labelProp] ?? item,
      disabled: options.disabled?.(item) ?? false
    }));
  }
}



/**
 * 根据选项数组动态生成 OptionProps 对象，并自动检测 labelProp 和 valueProp
 * @param key 字段键名
 * @param label 字段标签
 * @param options 选项数组，格式为 [{key1: any, key2: any}, ...]
 * @returns OptionProps 对象
 */
export function createSelectFieldConfig(
  // key: string,
  // label: string,
  options: Array<any>
): OptionProps {
  // 检测 labelProp 和 valueProp
  let labelProp = 'label';
  let valueProp = 'value';
  
  if (options && options.length > 0) {
    const firstOption = options[0];
    const keys = Object.keys(firstOption);
    
    if (keys.length >= 2) {
      labelProp = keys[0];  // 第一个键作为 labelProp
      valueProp = keys[1];  // 第二个键作为 valueProp
    } else if (keys.length === 1) {
      // 如果只有一个键，同时作为 labelProp 和 valueProp
      labelProp = keys[0];
      valueProp = keys[0];
    }
    
  } 
  return {
      defaultValues: options,
      labelProp,
      valueProp
    };
  
}
