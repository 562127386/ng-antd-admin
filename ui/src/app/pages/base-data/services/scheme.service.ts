import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { FormSchemaDto, ColumnSchemaDto, LookupSchemaDto } from '../models/scheme.model';

@Injectable({
  providedIn: 'root',
})
export class SchemeService {
  private apiUrl = environment.apiUrl + '/api/app/scheme';

  constructor(private http: HttpClient) {}

  getFormSchemas(entityName: string): Observable<FormSchemaDto[]> {
    let params = new HttpParams();
    if (entityName) {
      params = params.append('entityName', entityName);
    }
    return this.http.get<FormSchemaDto[]>(`${this.apiUrl}/form-schemas`, { params });
  }

  getColumnSchemas(entityName: string): Observable<ColumnSchemaDto[]> {
    let params = new HttpParams();
    if (entityName) {
      params = params.append('entityName', entityName);
    }
    return this.http.get<ColumnSchemaDto[]>(`${this.apiUrl}/column-schemas`, { params });
  }

  getLookupSchemas(entityName: string): Observable<LookupSchemaDto[]> {
    let params = new HttpParams();
    if (entityName) {
      params = params.append('entityName', entityName);
    }
    return this.http.get<LookupSchemaDto[]>(`${this.apiUrl}/lookup-schemas`, { params });
  }
}
