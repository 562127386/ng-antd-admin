import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { 
  InspectionStandardDto, 
  CreateUpdateInspectionStandardDto, 
  GetInspectionStandardListDto,
  PagedResultDto
} from '../models/inspection-standard.model';

@Injectable({
  providedIn: 'root',
})
export class InspectionStandardService {
  private apiUrl = environment.apiUrl + '/api/app/inspection-standard';

  constructor(private http: HttpClient) {}

  getList(input: GetInspectionStandardListDto): Observable<PagedResultDto<InspectionStandardDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<InspectionStandardDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<InspectionStandardDto> {
    return this.http.get<InspectionStandardDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateInspectionStandardDto): Observable<InspectionStandardDto> {
    return this.http.post<InspectionStandardDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateInspectionStandardDto): Observable<InspectionStandardDto> {
    return this.http.put<InspectionStandardDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publish(id: string): Observable<InspectionStandardDto> {
    return this.http.post<InspectionStandardDto>(`${this.apiUrl}/${id}/publish`, {});
  }
}
