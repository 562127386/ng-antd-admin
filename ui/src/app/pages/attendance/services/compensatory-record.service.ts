import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompensatoryRecord } from '../models/compensatory-record.model';

@Injectable({
  providedIn: 'root'
})
export class CompensatoryRecordService {
  private apiUrl = '/api/attendance/compensatory-records';

  constructor(private http: HttpClient) { }

  getCompensatoryRecords(): Observable<CompensatoryRecord[]> {
    return this.http.get<CompensatoryRecord[]>(this.apiUrl);
  }

  getCompensatoryRecord(id: string): Observable<CompensatoryRecord> {
    return this.http.get<CompensatoryRecord>(`${this.apiUrl}/${id}`);
  }

  createCompensatoryRecord(compensatoryRecord: any): Observable<CompensatoryRecord> {
    return this.http.post<CompensatoryRecord>(this.apiUrl, compensatoryRecord);
  }

  updateCompensatoryRecord(id: string, compensatoryRecord: any): Observable<CompensatoryRecord> {
    return this.http.put<CompensatoryRecord>(`${this.apiUrl}/${id}`, compensatoryRecord);
  }

  deleteCompensatoryRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
