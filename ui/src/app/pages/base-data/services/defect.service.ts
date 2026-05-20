import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { DefectDto, CreateUpdateDefectDto, GetDefectListDto, PagedResultDto } from '../models/defect.model';
import { Rest } from '@abp/ng.core';

@Injectable({
  providedIn: 'root',
})
export class DefectService {
  private apiUrl = environment['apiUrl'] + '/api/defects';

  constructor(private http: HttpClient) {}

  getList(input: GetDefectListDto): Observable<PagedResultDto<DefectDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<DefectDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<DefectDto> {
    return this.http.get<DefectDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateDefectDto): Observable<DefectDto> {
    return this.http.post<DefectDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateDefectDto): Observable<DefectDto> {
    return this.http.put<DefectDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setEnabled(id: string, isEnabled: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/enabled`, { isEnabled });
  }
    // setEnabled = (id: string, isEnabled: boolean, config?: Partial<Rest.Config>) =>
    //   this.restService.request<any, void>(
    //     {
    //       method: 'PUT',
    //       url: `/api/Defects/${id}/enabled`,
    //       body: isEnabled
    //     },
    //     { apiName: this.apiName, ...config }
    //   );

}
