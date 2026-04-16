import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceRule } from '../models/attendance-rule.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceRuleService {
  private apiUrl = '/api/attendance/attendance-rules';

  constructor(private http: HttpClient) { }

  getAttendanceRules(): Observable<AttendanceRule[]> {
    return this.http.get<AttendanceRule[]>(this.apiUrl);
  }

  getAttendanceRule(id: string): Observable<AttendanceRule> {
    return this.http.get<AttendanceRule>(`${this.apiUrl}/${id}`);
  }

  createAttendanceRule(attendanceRule: any): Observable<AttendanceRule> {
    return this.http.post<AttendanceRule>(this.apiUrl, attendanceRule);
  }

  updateAttendanceRule(id: string, attendanceRule: any): Observable<AttendanceRule> {
    return this.http.put<AttendanceRule>(`${this.apiUrl}/${id}`, attendanceRule);
  }

  deleteAttendanceRule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
