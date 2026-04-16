import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchedulingRule } from '../models/scheduling-rule.model';

@Injectable({
  providedIn: 'root'
})
export class SchedulingRuleService {
  private apiUrl = '/api/attendance/scheduling-rules';

  constructor(private http: HttpClient) { }

  getSchedulingRules(): Observable<SchedulingRule[]> {
    return this.http.get<SchedulingRule[]>(this.apiUrl);
  }

  getSchedulingRule(id: string): Observable<SchedulingRule> {
    return this.http.get<SchedulingRule>(`${this.apiUrl}/${id}`);
  }

  createSchedulingRule(schedulingRule: any): Observable<SchedulingRule> {
    return this.http.post<SchedulingRule>(this.apiUrl, schedulingRule);
  }

  updateSchedulingRule(id: string, schedulingRule: any): Observable<SchedulingRule> {
    return this.http.put<SchedulingRule>(`${this.apiUrl}/${id}`, schedulingRule);
  }

  deleteSchedulingRule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
