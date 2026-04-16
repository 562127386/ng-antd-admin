import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceImportConfig } from '../models/attendance-import-config.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceImportConfigService {
  private apiUrl = '/api/attendance/attendance-import-configs';

  constructor(private http: HttpClient) { }

  getAttendanceImportConfigs(): Observable<AttendanceImportConfig[]> {
    return this.http.get<AttendanceImportConfig[]>(this.apiUrl);
  }

  getAttendanceImportConfig(id: string): Observable<AttendanceImportConfig> {
    return this.http.get<AttendanceImportConfig>(`${this.apiUrl}/${id}`);
  }

  createAttendanceImportConfig(attendanceImportConfig: any): Observable<AttendanceImportConfig> {
    return this.http.post<AttendanceImportConfig>(this.apiUrl, attendanceImportConfig);
  }

  updateAttendanceImportConfig(id: string, attendanceImportConfig: any): Observable<AttendanceImportConfig> {
    return this.http.put<AttendanceImportConfig>(`${this.apiUrl}/${id}`, attendanceImportConfig);
  }

  deleteAttendanceImportConfig(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
