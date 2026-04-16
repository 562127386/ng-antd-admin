import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceStatistics } from '../models/attendance-statistics.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceStatisticsService {
  private apiUrl = '/api/attendance/attendance-statistics';

  constructor(private http: HttpClient) { }

  getAttendanceStatistics(): Observable<AttendanceStatistics[]> {
    return this.http.get<AttendanceStatistics[]>(this.apiUrl);
  }

  getAttendanceStatistic(id: string): Observable<AttendanceStatistics> {
    return this.http.get<AttendanceStatistics>(`${this.apiUrl}/${id}`);
  }

  createAttendanceStatistic(attendanceStatistics: any): Observable<AttendanceStatistics> {
    return this.http.post<AttendanceStatistics>(this.apiUrl, attendanceStatistics);
  }

  updateAttendanceStatistic(id: string, attendanceStatistics: any): Observable<AttendanceStatistics> {
    return this.http.put<AttendanceStatistics>(`${this.apiUrl}/${id}`, attendanceStatistics);
  }

  deleteAttendanceStatistic(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
