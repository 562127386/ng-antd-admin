import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceRecord } from '../models/attendance-record.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceRecordService {
  private apiUrl = '/api/attendance/attendance-records';

  constructor(private http: HttpClient) { }

  getAttendanceRecords(): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(this.apiUrl);
  }

  getAttendanceRecord(id: string): Observable<AttendanceRecord> {
    return this.http.get<AttendanceRecord>(`${this.apiUrl}/${id}`);
  }

  createAttendanceRecord(attendanceRecord: any): Observable<AttendanceRecord> {
    return this.http.post<AttendanceRecord>(this.apiUrl, attendanceRecord);
  }

  updateAttendanceRecord(id: string, attendanceRecord: any): Observable<AttendanceRecord> {
    return this.http.put<AttendanceRecord>(`${this.apiUrl}/${id}`, attendanceRecord);
  }

  deleteAttendanceRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
