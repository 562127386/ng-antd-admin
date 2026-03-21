import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { IqcInspectionOrderDto, CreateUpdateIqcInspectionOrderDto, GetIqcInspectionOrderListDto, IqcInspectionRecordDto, CreateUpdateIqcInspectionRecordDto, BatchSaveRecordsDto } from '../models/iqc-inspection.model';
import { PagedResultDto } from '../models/aql-config.model';
import { RuleEvaluationResult } from '../components/judgment-rules-display/judgment-rules-display.component';

@Injectable({
  providedIn: 'root',
})
export class IqcInspectionService {
  private apiUrl = environment.apiUrl + '/api/iqc-inspections';

  constructor(private http: HttpClient) {}

  getList(input: GetIqcInspectionOrderListDto): Observable<PagedResultDto<IqcInspectionOrderDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<IqcInspectionOrderDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<IqcInspectionOrderDto> {
    return this.http.get<IqcInspectionOrderDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateIqcInspectionOrderDto): Observable<IqcInspectionOrderDto> {
    return this.http.post<IqcInspectionOrderDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateIqcInspectionOrderDto): Observable<IqcInspectionOrderDto> {
    return this.http.put<IqcInspectionOrderDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  startInspection(id: string): Observable<IqcInspectionOrderDto> {
    return this.http.put<IqcInspectionOrderDto>(`${this.apiUrl}/${id}/start`, {});
  }

  completeInspection(id: string, input: { result: number; remark?: string; qualifiedSampleCount?: number; unqualifiedSampleCount?: number; incompleteSampleCount?: number; unqualifiedItemCount?: number; qualifiedItemCount?: number; pendingItemCount?: number }): Observable<IqcInspectionOrderDto> {
    return this.http.put<IqcInspectionOrderDto>(`${this.apiUrl}/${id}/complete`, input);
  }

  cancel(id: string): Observable<IqcInspectionOrderDto> {
    return this.http.put<IqcInspectionOrderDto>(`${this.apiUrl}/${id}/cancel`, {});
  }

  updateInspectionRecord(orderId: string, recordId: string, input: CreateUpdateIqcInspectionRecordDto): Observable<IqcInspectionRecordDto> {
    return this.http.put<IqcInspectionRecordDto>(`${this.apiUrl}/${orderId}/records/${recordId}`, input);
  }

  submit(id: string): Observable<IqcInspectionOrderDto> {
    return this.http.put<IqcInspectionOrderDto>(`${this.apiUrl}/${id}/submit`, {});
  }

  evaluateRule(rulesJson: string | null, actualValue: string | null): Observable<RuleEvaluationResult[]> {
    let params = new HttpParams();
    if (rulesJson) params = params.set('rulesJson', rulesJson);
    if (actualValue) params = params.set('actualValue', actualValue);
    
    const evaluateRuleUrl = environment.apiUrl + '/api/iqc-inspections/evaluate-rule';
    return this.http.post<RuleEvaluationResult[]>(evaluateRuleUrl, {}, { params });
  }

  saveAllRecords(input: BatchSaveRecordsDto): Observable<IqcInspectionOrderDto> {
    return this.http.post<IqcInspectionOrderDto>(`${this.apiUrl}/save-all-records`, input);
  }
}
