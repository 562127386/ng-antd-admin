import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@app/core/services/http/base-http.service';
import { QualityIndicatorDto, CreateUpdateQualityIndicatorDto, InspectionRuleDto, CreateUpdateInspectionRuleDto } from '../models/quality-indicator.model';

@Injectable({
  providedIn: 'root'
})
export class QualityIndicatorService extends BaseHttpService {
  private apiUrl = '/api/app/quality-indicator';

  getList(params: { skipCount?: number; maxResultCount?: number; sorting?: string }) {
    return this.get<{ items: QualityIndicatorDto[]; totalCount: number }>(this.apiUrl, params, { isAbpApi: true });
  }

  getAllItems() {
    return this.get<QualityIndicatorDto[]>(`${this.apiUrl}/items`, {}, { isAbpApi: true });
  }

  override get<T>(path: string, param?: any, config?: any): Observable<T> {
    return super.get<T>(path, param, config);
  }

  create(data: CreateUpdateQualityIndicatorDto) {
    return this.post<QualityIndicatorDto>(this.apiUrl, data, { isAbpApi: true });
  }

  update(id: string, data: CreateUpdateQualityIndicatorDto) {
    return this.put<QualityIndicatorDto>(`${this.apiUrl}/${id}`, data, { isAbpApi: true });
  }

  override delete<T>(path: string, param?: any, config?: any): Observable<T> {
    return super.delete<T>(path, param, config);
  }

  getById(id: string) {
    return this.get<QualityIndicatorDto>(`${this.apiUrl}/${id}`, {}, { isAbpApi: true });
  }

  deleteById(id: string) {
    return this.delete(`${this.apiUrl}/${id}`, {}, { isAbpApi: true });
  }

  deleteByIds(ids: string[]) {
    const params = ids.map(id => `ids=${id}`).join('&');
    return this.delete(`${this.apiUrl}/many?${params}`, {}, { isAbpApi: true });
  }

  // 判定规则相关方法
  getInspectionRules(qualityIndicatorId: string) {
    return this.get<InspectionRuleDto[]>(`/api/app/quality-indicator/inspection-rules/${qualityIndicatorId}`, {}, { isAbpApi: true });
  }

  createInspectionRule(qualityIndicatorId: string, data: CreateUpdateInspectionRuleDto) {
    return this.post<InspectionRuleDto>(`/api/app/quality-indicator/inspection-rule/${qualityIndicatorId}`, data, { isAbpApi: true });
  }

  updateInspectionRule(id: string, data: CreateUpdateInspectionRuleDto) {
    return this.put<InspectionRuleDto>(`/api/app/quality-indicator/${id}/inspection-rule`, data, { isAbpApi: true });
  }

  deleteInspectionRule(id: string) {
    return this.delete(`/api/app/quality-indicator/inspection-rule/${id}`, {}, { isAbpApi: true });
  }
}
