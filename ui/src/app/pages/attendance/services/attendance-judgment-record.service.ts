import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceJudgmentRecord } from '../models/attendance-judgment-record.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceJudgmentRecordService {
  private apiUrl = '/api/attendance/attendance-judgment-records';

  constructor(private http: HttpClient) { }

  getAttendanceJudgmentRecords(): Observable<AttendanceJudgmentRecord[]> {
    return this.http.get<AttendanceJudgmentRecord[]>(this.apiUrl);
  }

  getAttendanceJudgmentRecord(id: string): Observable<AttendanceJudgmentRecord> {
    return this.http.get<AttendanceJudgmentRecord>(`${this.apiUrl}/${id}`);
  }

  createAttendanceJudgmentRecord(attendanceJudgmentRecord: any): Observable<AttendanceJudgmentRecord> {
    return this.http.post<AttendanceJudgmentRecord>(this.apiUrl, attendanceJudgmentRecord);
  }

  updateAttendanceJudgmentRecord(id: string, attendanceJudgmentRecord: any): Observable<AttendanceJudgmentRecord> {
    return this.http.put<AttendanceJudgmentRecord>(`${this.apiUrl}/${id}`, attendanceJudgmentRecord);
  }

  deleteAttendanceJudgmentRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
