import type { GeneratedSchemaDto, ScanHistoryDto, ScanResultDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntitySchemaScannerService {
  private restService = inject(RestService);
  apiName = 'Default';

  getScanHistory = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScanHistoryDto[]>(
      {
        method: 'GET',
        url: '/api/app/entity-schema-scanner/scan-history'
      },
      { apiName: this.apiName, ...config }
    );

  regenerateSchema = (entityName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GeneratedSchemaDto>(
      {
        method: 'POST',
        url: '/api/app/entity-schema-scanner/regenerate-schema',
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );

  scanAllEntities = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ScanResultDto>(
      {
        method: 'POST',
        url: '/api/app/entity-schema-scanner/scan-all-entities'
      },
      { apiName: this.apiName, ...config }
    );

  scanEntity = (entityName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GeneratedSchemaDto>(
      {
        method: 'POST',
        url: '/api/app/entity-schema-scanner/scan-entity',
        params: { entityName }
      },
      { apiName: this.apiName, ...config }
    );
}
