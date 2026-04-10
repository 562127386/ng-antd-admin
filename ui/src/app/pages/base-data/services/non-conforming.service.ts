import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { NonConformingDto, CreateUpdateNonConformingDto, GetNonConformingListDto, CompleteReviewInput, CompleteDisposalInput } from '../models/non-conforming.model';
import { PagedResultDto } from '../models/aql-config.model';

@Injectable({
  providedIn: 'root',
})
export class NonConformingService {
  private apiUrl = environment['apiUrl'] + '/api/non-conformings';

  constructor(private http: HttpClient) {}

  getList(input: GetNonConformingListDto): Observable<PagedResultDto<NonConformingDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<NonConformingDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<NonConformingDto> {
    return this.http.get<NonConformingDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateNonConformingDto): Observable<NonConformingDto> {
    return this.http.post<NonConformingDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateNonConformingDto): Observable<NonConformingDto> {
    return this.http.put<NonConformingDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  startReview(id: string): Observable<NonConformingDto> {
    return this.http.put<NonConformingDto>(`${this.apiUrl}/${id}/start-review`, {});
  }

  completeReview(id: string, input: CompleteReviewInput): Observable<NonConformingDto> {
    return this.http.put<NonConformingDto>(`${this.apiUrl}/${id}/complete-review`, input);
  }

  startDisposal(id: string): Observable<NonConformingDto> {
    return this.http.put<NonConformingDto>(`${this.apiUrl}/${id}/start-disposal`, {});
  }

  completeDisposal(id: string, input: CompleteDisposalInput): Observable<NonConformingDto> {
    return this.http.put<NonConformingDto>(`${this.apiUrl}/${id}/complete-disposal`, input);
  }

  createFromIqcInspection(inspectionOrderId: string): Observable<NonConformingDto> {
    return this.http.post<NonConformingDto>(`${this.apiUrl}/create-from-iqc-inspection/${inspectionOrderId}`, {});
  }

  getByOrderNo(orderNo: string): Observable<NonConformingDto> {
    return this.http.get<NonConformingDto>(`${this.apiUrl}/by-order-no/${orderNo}`);
  }
}
