import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplierDto, CreateUpdateSupplierDto, GetSupplierListDto } from '../models/supplier.model';
import { PagedResultDto } from '../models/aql-config.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private apiUrl = '/api/suppliers';

  constructor(private http: HttpClient) {}

  getList(input: GetSupplierListDto): Observable<PagedResultDto<SupplierDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<SupplierDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<SupplierDto> {
    return this.http.get<SupplierDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateSupplierDto): Observable<SupplierDto> {
    return this.http.post<SupplierDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateSupplierDto): Observable<SupplierDto> {
    return this.http.put<SupplierDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setEnabled(id: string, isEnabled: boolean): Observable<SupplierDto> {
    return this.http.put<SupplierDto>(`${this.apiUrl}/${id}/enabled`, isEnabled);
  }
}
