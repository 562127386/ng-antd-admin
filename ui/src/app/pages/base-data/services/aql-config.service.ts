import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AqlConfigDto, CreateUpdateAqlConfigDto, GetAqlConfigListDto, PagedResultDto } from '../models/aql-config.model';

@Injectable({
  providedIn: 'root',
})
export class AqlConfigService {
  private apiUrl = environment.apiUrl + '/api/app/aql-config';

  constructor(private http: HttpClient) {}

  getList(input: GetAqlConfigListDto): Observable<PagedResultDto<AqlConfigDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<AqlConfigDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<AqlConfigDto> {
    return this.http.get<AqlConfigDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateAqlConfigDto): Observable<AqlConfigDto> {
    return this.http.post<AqlConfigDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateAqlConfigDto): Observable<AqlConfigDto> {
    return this.http.put<AqlConfigDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setEnabled(id: string, isEnabled: boolean): Observable<AqlConfigDto> {
    return this.http.put<AqlConfigDto>(`${this.apiUrl}/${id}/set-enabled`, isEnabled);
  }

  findBestMatch(samplingSchemeId: string | null, lotSize: number, aqlValue?: number): Observable<AqlConfigDto | null> {
    let params = new HttpParams();
    params = params.append('lotSize', lotSize.toString());
    if (aqlValue !== undefined && aqlValue !== null) {
      params = params.append('aqlValue', aqlValue.toString());
    }
    const url = samplingSchemeId 
      ? `${this.apiUrl}/find-best-match/${samplingSchemeId}`
      : `${this.apiUrl}/find-best-match`;
    return this.http.post<AqlConfigDto | null>(url, null, { params });
  }
}
