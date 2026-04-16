import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicHoliday } from '../models/public-holiday.model';

@Injectable({
  providedIn: 'root'
})
export class PublicHolidayService {
  private apiUrl = '/api/attendance/public-holidays';

  constructor(private http: HttpClient) { }

  getPublicHolidays(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(this.apiUrl);
  }

  getPublicHoliday(id: string): Observable<PublicHoliday> {
    return this.http.get<PublicHoliday>(`${this.apiUrl}/${id}`);
  }

  createPublicHoliday(publicHoliday: any): Observable<PublicHoliday> {
    return this.http.post<PublicHoliday>(this.apiUrl, publicHoliday);
  }

  updatePublicHoliday(id: string, publicHoliday: any): Observable<PublicHoliday> {
    return this.http.put<PublicHoliday>(`${this.apiUrl}/${id}`, publicHoliday);
  }

  deletePublicHoliday(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
