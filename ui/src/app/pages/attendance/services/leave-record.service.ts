import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRecord } from '../models/leave-record.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveRecordService {
  private apiUrl = '/api/attendance/leave-records';

  constructor(private http: HttpClient) { }

  getLeaveRecords(): Observable<LeaveRecord[]> {
    return this.http.get<LeaveRecord[]>(this.apiUrl);
  }

  getLeaveRecord(id: string): Observable<LeaveRecord> {
    return this.http.get<LeaveRecord>(`${this.apiUrl}/${id}`);
  }

  createLeaveRecord(leaveRecord: any): Observable<LeaveRecord> {
    return this.http.post<LeaveRecord>(this.apiUrl, leaveRecord);
  }

  updateLeaveRecord(id: string, leaveRecord: any): Observable<LeaveRecord> {
    return this.http.put<LeaveRecord>(`${this.apiUrl}/${id}`, leaveRecord);
  }

  deleteLeaveRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
