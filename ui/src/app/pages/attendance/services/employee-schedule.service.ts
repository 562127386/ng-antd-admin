import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeSchedule } from '../models/employee-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeScheduleService {
  private apiUrl = '/api/attendance/employee-schedules';

  constructor(private http: HttpClient) { }

  getEmployeeSchedules(): Observable<EmployeeSchedule[]> {
    return this.http.get<EmployeeSchedule[]>(this.apiUrl);
  }

  getEmployeeSchedule(id: string): Observable<EmployeeSchedule> {
    return this.http.get<EmployeeSchedule>(`${this.apiUrl}/${id}`);
  }

  createEmployeeSchedule(employeeSchedule: any): Observable<EmployeeSchedule> {
    return this.http.post<EmployeeSchedule>(this.apiUrl, employeeSchedule);
  }

  updateEmployeeSchedule(id: string, employeeSchedule: any): Observable<EmployeeSchedule> {
    return this.http.put<EmployeeSchedule>(`${this.apiUrl}/${id}`, employeeSchedule);
  }

  deleteEmployeeSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
