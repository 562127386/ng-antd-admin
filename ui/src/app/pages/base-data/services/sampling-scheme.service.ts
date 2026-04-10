import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { SamplingSchemeDto, CreateUpdateSamplingSchemeDto, GetSamplingSchemeListDto } from '../models/sampling-scheme.model';
import { PagedResultDto } from '../models/aql-config.model';

@Injectable({
  providedIn: 'root',
})
export class SamplingSchemeService {
  private apiUrl = environment['apiUrl'] + '/api/sampling-schemes';

  constructor(private http: HttpClient) {}

  getList(input: GetSamplingSchemeListDto): Observable<PagedResultDto<SamplingSchemeDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<SamplingSchemeDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<SamplingSchemeDto> {
    return this.http.get<SamplingSchemeDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateSamplingSchemeDto): Observable<SamplingSchemeDto> {
    return this.http.post<SamplingSchemeDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateSamplingSchemeDto): Observable<SamplingSchemeDto> {
    return this.http.put<SamplingSchemeDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setEnabled(id: string, isEnabled: boolean): Observable<SamplingSchemeDto> {
    return this.http.put<SamplingSchemeDto>(`${this.apiUrl}/${id}/enabled`, isEnabled);
  }
}
