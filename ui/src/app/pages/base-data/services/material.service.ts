import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaterialDto, CreateUpdateMaterialDto, GetMaterialListDto } from '../models/material.model';
import { PagedResultDto } from '../models/defect.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private apiUrl = '/api/materials';

  constructor(private http: HttpClient) {}

  getList(input: GetMaterialListDto): Observable<PagedResultDto<MaterialDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<MaterialDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<MaterialDto> {
    return this.http.get<MaterialDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateMaterialDto): Observable<MaterialDto> {
    return this.http.post<MaterialDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateMaterialDto): Observable<MaterialDto> {
    return this.http.put<MaterialDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
