import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';
import type {
  AssignComplaintDto,
  Complaint8DDto,
  ComplaintAttachmentDto,
  ComplaintCommentDto,
  ComplaintCostDto,
  ComplaintDashboardDto,
  ComplaintDto,
  ComplaintStatusLogDto,
  ComplaintSummaryDto,
  CompleteD8Dto,
  CreateUpdateComplaintCommentDto,
  CreateUpdateComplaintCostDto,
  CreateUpdateComplaintDto,
  FQCTraceDto,
  FullTraceReportDto,
  GetComplaintAttachmentListDto,
  GetComplaintCommentListDto,
  GetComplaintCostListDto,
  GetComplaintListDto,
  GetComplaintStatusLogListDto,
  HistoricalComplaintDto,
  IPQCTraceDto,
  IQCTraceDto,
  MaterialTraceDto,
  ProductionTraceDto,
  SupplierTraceDto,
  UpdateD1Dto,
  UpdateD2Dto,
  UpdateD3Dto,
  UpdateD4Dto,
  UpdateD5Dto,
  UpdateD6Dto,
  UpdateD7Dto,
  UpdateStatusDto,
  UploadAttachmentDto
} from '../contracts/complaints/models';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private restService = inject(RestService);
  apiName = 'Default';

  assign = (id: string, input: AssignComplaintDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/${id}/assign`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  completeD8 = (complaintId: string, input: CompleteD8Dto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/complete-d8/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateUpdateComplaintDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintDto>(
      {
        method: 'POST',
        url: '/api/app/complaint',
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  createComment = (complaintId: string, input: CreateUpdateComplaintCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintCommentDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/comment/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  createCost = (complaintId: string, input: CreateUpdateComplaintCostDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintCostDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/cost/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/complaint/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  deleteAttachment = (complaintId: string, attachmentId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: '/api/app/complaint/attachment',
        params: { complaintId, attachmentId }
      },
      { apiName: this.apiName, ...config }
    );

  deleteComment = (complaintId: string, commentId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: '/api/app/complaint/comment',
        params: { complaintId, commentId }
      },
      { apiName: this.apiName, ...config }
    );

  deleteCost = (complaintId: string, costId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: '/api/app/complaint/cost',
        params: { complaintId, costId }
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintDto>(
      {
        method: 'GET',
        url: `/api/app/complaint/${id}`
      },
      { apiName: this.apiName, ...config }
    );

  get8D = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'GET',
        url: `/api/app/complaint/8D/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  getAttachments = (complaintId: string, input: GetComplaintAttachmentListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ComplaintAttachmentDto>>(
      {
        method: 'GET',
        url: `/api/app/complaint/attachments/${complaintId}`,
        params: { related8DStep: input.related8DStep, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  getComments = (complaintId: string, input: GetComplaintCommentListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ComplaintCommentDto>>(
      {
        method: 'GET',
        url: `/api/app/complaint/comments/${complaintId}`,
        params: { parentId: input.parentId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  getCosts = (complaintId: string, input: GetComplaintCostListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ComplaintCostDto>>(
      {
        method: 'GET',
        url: `/api/app/complaint/costs/${complaintId}`,
        params: { costType: input.costType, costCategory: input.costCategory, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  getDashboard = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintDashboardDto>(
      {
        method: 'GET',
        url: '/api/app/complaint/dashboard'
      },
      { apiName: this.apiName, ...config }
    );

  getDownloadUrl = (complaintId: string, attachmentId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>(
      {
        method: 'GET',
        responseType: 'text',
        url: '/api/app/complaint/download-url',
        params: { complaintId, attachmentId }
      },
      { apiName: this.apiName, ...config }
    );

  getFullTraceReport = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FullTraceReportDto>(
      {
        method: 'GET',
        url: `/api/app/complaint/full-trace-report/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GetComplaintListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ComplaintDto>>(
      {
        method: 'GET',
        url: '/api/app/complaint',
        params: {
          filter: input.filter,
          complaintNo: input.complaintNo,
          customerId: input.customerId,
          productId: input.productId,
          productBatch: input.productBatch,
          severityLevel: input.severityLevel,
          status: input.status,
          assignedTo: input.assignedTo,
          assignedTeam: input.assignedTeam,
          occurrenceDateFrom: input.occurrenceDateFrom,
          occurrenceDateTo: input.occurrenceDateTo,
          creationDateFrom: input.creationDateFrom,
          creationDateTo: input.creationDateTo,
          is8DRequired: input.is8DRequired,
          isOverdue: input.isOverdue,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount
        }
      },
      { apiName: this.apiName, ...config }
    );

  getStatusLogs = (complaintId: string, input: GetComplaintStatusLogListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ComplaintStatusLogDto>>(
      {
        method: 'GET',
        url: `/api/app/complaint/status-logs/${complaintId}`,
        params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount }
      },
      { apiName: this.apiName, ...config }
    );

  getSummary = (input: GetComplaintListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintSummaryDto>(
      {
        method: 'GET',
        url: '/api/app/complaint/summary',
        params: {
          filter: input.filter,
          complaintNo: input.complaintNo,
          customerId: input.customerId,
          productId: input.productId,
          productBatch: input.productBatch,
          severityLevel: input.severityLevel,
          status: input.status,
          assignedTo: input.assignedTo,
          assignedTeam: input.assignedTeam,
          occurrenceDateFrom: input.occurrenceDateFrom,
          occurrenceDateTo: input.occurrenceDateTo,
          creationDateFrom: input.creationDateFrom,
          creationDateTo: input.creationDateTo,
          is8DRequired: input.is8DRequired,
          isOverdue: input.isOverdue,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount
        }
      },
      { apiName: this.apiName, ...config }
    );

  traceFQC = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FQCTraceDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/trace-fQC/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  traceHistorical = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, HistoricalComplaintDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/trace-historical/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  traceIPQC = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IPQCTraceDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/trace-iPQC/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  traceIQC = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IQCTraceDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/trace-iQC/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  traceMaterial = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MaterialTraceDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/trace-material/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  traceProduction = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductionTraceDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/trace-production/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  traceSupplier = (complaintId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SupplierTraceDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/trace-supplier/${complaintId}`
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateComplaintDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/${id}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateCost = (complaintId: string, costId: string, input: CreateUpdateComplaintCostDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintCostDto>(
      {
        method: 'PUT',
        url: '/api/app/complaint/cost',
        params: { complaintId, costId },
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateD1 = (complaintId: string, input: UpdateD1Dto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/d1/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateD2 = (complaintId: string, input: UpdateD2Dto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/d2/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateD3 = (complaintId: string, input: UpdateD3Dto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/d3/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateD4 = (complaintId: string, input: UpdateD4Dto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/d4/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateD5 = (complaintId: string, input: UpdateD5Dto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/d5/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateD6 = (complaintId: string, input: UpdateD6Dto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/d6/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateD7 = (complaintId: string, input: UpdateD7Dto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Complaint8DDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/d7/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  updateStatus = (id: string, input: UpdateStatusDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintDto>(
      {
        method: 'PUT',
        url: `/api/app/complaint/${id}/status`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );

  uploadAttachment = (complaintId: string, input: UploadAttachmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ComplaintAttachmentDto>(
      {
        method: 'POST',
        url: `/api/app/complaint/upload-attachment/${complaintId}`,
        body: input
      },
      { apiName: this.apiName, ...config }
    );
}
