import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OvertimeRecord } from '../models/overtime-record.model';

@Injectable({
  providedIn: 'root'
})
export class OvertimeRecordService {
  private apiUrl = '/api/attendance/overtime-records';

  constructor(private http: HttpClient) { }

  getOvertimeRecords(): Observable<OvertimeRecord[]> {
    return this.http.get<OvertimeRecord[]>(this.apiUrl);
  }

  getOvertimeRecord(id: string): Observable<OvertimeRecord> {
    return this.http.get<OvertimeRecord>(`${this.apiUrl}/${id}`);
  }

  createOvertimeRecord(overtimeRecord: any): Observable<OvertimeRecord> {
    return this.http.post<OvertimeRecord>(this.apiUrl, overtimeRecord);
  }

  updateOvertimeRecord(id: string, overtimeRecord: any): Observable<OvertimeRecord> {
    return this.http.put<OvertimeRecord>(`${this.apiUrl}/${id}`, overtimeRecord);
  }

  deleteOvertimeRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
