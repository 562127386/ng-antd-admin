import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@app/core/services/http/base-http.service';
import { GeneralInspectionItemDto, CreateUpdateGeneralInspectionItemDto } from '../models/general-inspection-item.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralInspectionItemService extends BaseHttpService {
  private apiUrl = '/api/base-data/general-inspection-items';

  getList(params: { skipCount?: number; maxResultCount?: number; sorting?: string }) {
    return this.get<{ items: GeneralInspectionItemDto[]; totalCount: number }>(this.apiUrl, params, { isAbpApi: true });
  }

  getAllItems() {
    return this.get<GeneralInspectionItemDto[]>(`${this.apiUrl}/all`, {}, { isAbpApi: true });
  }

  override get<T>(path: string, param?: any, config?: any): Observable<T> {
    return super.get<T>(path, param, config);
  }

  create(data: CreateUpdateGeneralInspectionItemDto) {
    return this.post<GeneralInspectionItemDto>(this.apiUrl, data, { isAbpApi: true });
  }

  update(id: string, data: CreateUpdateGeneralInspectionItemDto) {
    return this.put<GeneralInspectionItemDto>(`${this.apiUrl}/${id}`, data, { isAbpApi: true });
  }

  override delete<T>(path: string, param?: any, config?: any): Observable<T> {
    return super.delete<T>(path, param, config);
  }

  getById(id: string) {
    return this.get<GeneralInspectionItemDto>(`${this.apiUrl}/${id}`, {}, { isAbpApi: true });
  }

  deleteById(id: string) {
    return this.delete(`${this.apiUrl}/${id}`, {}, { isAbpApi: true });
  }
}
