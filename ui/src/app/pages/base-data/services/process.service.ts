import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcessDto, CreateUpdateProcessDto, GetProcessListDto } from '../models/process.model';
import { PagedResultDto } from '../models/defect.model';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private apiUrl = '/api/processes';

  constructor(private http: HttpClient) {}

  getList(input: GetProcessListDto): Observable<PagedResultDto<ProcessDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<ProcessDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<ProcessDto> {
    return this.http.get<ProcessDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateProcessDto): Observable<ProcessDto> {
    return this.http.post<ProcessDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateProcessDto): Observable<ProcessDto> {
    return this.http.put<ProcessDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
