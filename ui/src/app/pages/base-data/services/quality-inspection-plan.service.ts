import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { 
  QualityInspectionPlanDto, 
  CreateUpdateQualityInspectionPlanDto, 
  GetQualityInspectionPlanListDto,
  PagedResultDto
} from '../models/quality-inspection-plan.model';

@Injectable({
  providedIn: 'root',
})
export class QualityInspectionPlanService {
  private apiUrl = environment.apiUrl + '/api/app/quality-inspection-plan';

  constructor(private http: HttpClient) {}

  getList(input: GetQualityInspectionPlanListDto): Observable<PagedResultDto<QualityInspectionPlanDto>> {
    let params = new HttpParams();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value.toString());
      }
    });
    return this.http.get<PagedResultDto<QualityInspectionPlanDto>>(this.apiUrl, { params });
  }

  get(id: string): Observable<QualityInspectionPlanDto> {
    return this.http.get<QualityInspectionPlanDto>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateUpdateQualityInspectionPlanDto): Observable<QualityInspectionPlanDto> {
    return this.http.post<QualityInspectionPlanDto>(this.apiUrl, input);
  }

  update(id: string, input: CreateUpdateQualityInspectionPlanDto): Observable<QualityInspectionPlanDto> {
    return this.http.put<QualityInspectionPlanDto>(`${this.apiUrl}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  publish(id: string): Observable<QualityInspectionPlanDto> {
    return this.http.post<QualityInspectionPlanDto>(`${this.apiUrl}/${id}/publish`, {});
  }
}
