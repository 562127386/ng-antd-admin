import { Injectable } from '@angular/core';
import { RestService } from '@abp/ng.core';
import { Observable } from 'rxjs';
import {
  Complaint,
  Complaint8D,
  ComplaintCost,
  ComplaintAttachment,
  ComplaintComment,
  ComplaintStatusLog,
  ComplaintDashboard,
  FullTraceReport,
  CreateUpdateComplaint,
  AssignComplaint,
  UpdateStatus,
  GetComplaintList,
  PagedResult
} from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = '/api/app/complaint';

  constructor(private rest: RestService) {}

  getComplaints(params: GetComplaintList): Observable<PagedResult<Complaint>> {
    const queryParams: any = {};
    if (params.filter) queryParams.filter = params.filter;
    if (params.complaintNo) queryParams.complaintNo = params.complaintNo;
    if (params.customerId) queryParams.customerId = params.customerId;
    if (params.productId) queryParams.productId = params.productId;
    if (params.productBatch) queryParams.productBatch = params.productBatch;
    if (params.severityLevel !== undefined) queryParams.severityLevel = params.severityLevel;
    if (params.status !== undefined) queryParams.status = params.status;
    if (params.assignedTo) queryParams.assignedTo = params.assignedTo;
    if (params.assignedTeam) queryParams.assignedTeam = params.assignedTeam;
    if (params.is8DRequired !== undefined) queryParams.is8DRequired = params.is8DRequired;
    if (params.isOverdue !== undefined) queryParams.isOverdue = params.isOverdue;
    if (params.sorting) queryParams.sorting = params.sorting;
    if (params.skipCount !== undefined) queryParams.skipCount = params.skipCount;
    if (params.maxResultCount !== undefined) queryParams.maxResultCount = params.maxResultCount;

    return this.rest.request<any, PagedResult<Complaint>>({
      method: 'GET',
      url: this.apiUrl,
      params: queryParams
    });
  }

  getComplaint(id: string): Observable<Complaint> {
    return this.rest.request<any, Complaint>({
      method: 'GET',
      url: `${this.apiUrl}/${id}`
    });
  }

  createComplaint(complaint: CreateUpdateComplaint): Observable<Complaint> {
    return this.rest.request<CreateUpdateComplaint, Complaint>({
      method: 'POST',
      url: this.apiUrl,
      body: complaint
    });
  }

  updateComplaint(id: string, complaint: CreateUpdateComplaint): Observable<Complaint> {
    return this.rest.request<CreateUpdateComplaint, Complaint>({
      method: 'PUT',
      url: `${this.apiUrl}/${id}`,
      body: complaint
    });
  }

  deleteComplaint(id: string): Observable<void> {
    return this.rest.request<void, any>({
      method: 'DELETE',
      url: `${this.apiUrl}/${id}`
    });
  }

  assignComplaint(id: string, assignDto: AssignComplaint): Observable<Complaint> {
    const requestBody: any = {
      AssigneeId: assignDto.assigneeId,
      AssigneeName: assignDto.assigneeName,
      Team: assignDto.team,
      Remark: assignDto.remark
    };
    return this.rest.request<any, Complaint>({
      method: 'POST',
      url: `${this.apiUrl}/${id}/assign`,
      body: requestBody
    });
  }

  updateStatus(id: string, updateStatusDto: UpdateStatus): Observable<Complaint> {
    const requestBody: any = {
      NewStatus: updateStatusDto.newStatus,
      Remark: updateStatusDto.remark
    };
    return this.rest.request<any, Complaint>({
      method: 'PUT',
      url: `${this.apiUrl}/${id}/status`,
      body: requestBody
    });
  }

  get8D(complaintId: string): Observable<Complaint8D> {
    return this.rest.request<any, Complaint8D>({
      method: 'GET',
      url: `${this.apiUrl}/${complaintId}/8d`
    });
  }

  updateD1(complaintId: string, d1Data: { teamMembers: string }): Observable<Complaint8D> {
    const requestBody: any = {
      TeamMembers: d1Data.teamMembers
    };
    return this.rest.request<any, Complaint8D>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/8d/d1`,
      body: requestBody
    });
  }

  updateD2(complaintId: string, d2Data: { problemDetails: string; photos?: string }): Observable<Complaint8D> {
    const requestBody: any = {
      ProblemDetails: d2Data.problemDetails
    };
    if (d2Data.photos) requestBody.Photos = d2Data.photos;
    return this.rest.request<any, Complaint8D>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/8d/d2`,
      body: requestBody
    });
  }

  updateD3(complaintId: string, d3Data: { containmentAction: string; verificationResult: string }): Observable<Complaint8D> {
    const requestBody: any = {
      ContainmentAction: d3Data.containmentAction,
      VerificationResult: d3Data.verificationResult
    };
    return this.rest.request<any, Complaint8D>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/8d/d3`,
      body: requestBody
    });
  }

  updateD4(complaintId: string, d4Data: { rootCauses: string; analysisTools?: string }): Observable<Complaint8D> {
    const requestBody: any = {
      RootCauses: d4Data.rootCauses
    };
    if (d4Data.analysisTools) requestBody.AnalysisTools = d4Data.analysisTools;
    return this.rest.request<any, Complaint8D>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/8d/d4`,
      body: requestBody
    });
  }

  updateD5(complaintId: string, d5Data: { correctiveActions: string }): Observable<Complaint8D> {
    const requestBody: any = {
      CorrectiveActions: d5Data.correctiveActions
    };
    return this.rest.request<any, Complaint8D>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/8d/d5`,
      body: requestBody
    });
  }

  updateD6(complaintId: string, d6Data: { implementationTrack: string }): Observable<Complaint8D> {
    const requestBody: any = {
      ImplementationTrack: d6Data.implementationTrack
    };
    return this.rest.request<any, Complaint8D>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/8d/d6`,
      body: requestBody
    });
  }

  updateD7(complaintId: string, d7Data: { standardization: string }): Observable<Complaint8D> {
    const requestBody: any = {
      Standardization: d7Data.standardization
    };
    return this.rest.request<any, Complaint8D>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/8d/d7`,
      body: requestBody
    });
  }

  completeD8(complaintId: string, d8Data: { conclusion: string; customerConfirmation: boolean }): Observable<Complaint8D> {
    const requestBody: any = {
      Conclusion: d8Data.conclusion,
      CustomerConfirmation: d8Data.customerConfirmation
    };
    return this.rest.request<any, Complaint8D>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/8d/d8`,
      body: requestBody
    });
  }

  getCosts(complaintId: string, params?: { costType?: number; costCategory?: number }): Observable<PagedResult<ComplaintCost>> {
    const queryParams: any = {};
    if (params?.costType !== undefined) queryParams.costType = params.costType;
    if (params?.costCategory !== undefined) queryParams.costCategory = params.costCategory;

    return this.rest.request<any, PagedResult<ComplaintCost>>({
      method: 'GET',
      url: `${this.apiUrl}/costs/${complaintId}`,
      params: queryParams
    });
  }

  createCost(complaintId: string, cost: any): Observable<ComplaintCost> {
    const requestBody: any = {
      costType: cost.costType,
      costCategory: cost.costCategory,
      amount: cost.amount
    };
    if (cost.description) requestBody.description = cost.description;

    return this.rest.request<any, ComplaintCost>({
      method: 'POST',
      url: `${this.apiUrl}/${complaintId}/costs`,
      body: requestBody
    });
  }

  updateCost(complaintId: string, costId: string, cost: any): Observable<ComplaintCost> {
    const requestBody: any = {
      costType: cost.costType,
      costCategory: cost.costCategory,
      amount: cost.amount
    };
    if (cost.description) requestBody.description = cost.description;

    return this.rest.request<any, ComplaintCost>({
      method: 'PUT',
      url: `${this.apiUrl}/${complaintId}/costs/${costId}`,
      body: requestBody
    });
  }

  deleteCost(complaintId: string, costId: string): Observable<void> {
    return this.rest.request<void, any>({
      method: 'DELETE',
      url: `${this.apiUrl}/${complaintId}/costs/${costId}`
    });
  }

  getAttachments(complaintId: string, related8DStep?: string): Observable<PagedResult<ComplaintAttachment>> {
    const queryParams: any = {};
    if (related8DStep) queryParams.related8DStep = related8DStep;

    return this.rest.request<any, PagedResult<ComplaintAttachment>>({
      method: 'GET',
      url: `${this.apiUrl}/attachments/${complaintId}`,
      params: queryParams
    });
  }

  uploadAttachment(complaintId: string, file: any, related8DStep?: string): Observable<ComplaintAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    if (related8DStep) formData.append('related8DStep', related8DStep);

    return this.rest.request<FormData, ComplaintAttachment>({
      method: 'POST',
      url: `${this.apiUrl}/attachments/${complaintId}`,
      body: formData
    });
  }

  deleteAttachment(complaintId: string, attachmentId: string): Observable<void> {
    return this.rest.request<void, any>({
      method: 'DELETE',
      url: `${this.apiUrl}/${complaintId}/attachments/${attachmentId}`
    });
  }

  getComments(complaintId: string, parentId?: string): Observable<PagedResult<ComplaintComment>> {
    const queryParams: any = {};
    if (parentId) queryParams.parentId = parentId;

    return this.rest.request<any, PagedResult<ComplaintComment>>({
      method: 'GET',
      url: `${this.apiUrl}/comments/${complaintId}`,
      params: queryParams
    });
  }

  createComment(complaintId: string, comment: { content: string; mentionedUsers?: string; parentId?: string }): Observable<ComplaintComment> {
    const requestBody: any = {
      content: comment.content
    };
    if (comment.mentionedUsers) requestBody.mentionedUsers = comment.mentionedUsers;
    if (comment.parentId) requestBody.parentId = comment.parentId;

    return this.rest.request<any, ComplaintComment>({
      method: 'POST',
      url: `${this.apiUrl}/comment/${complaintId}`,
      body: requestBody
    });
  }

  deleteComment(complaintId: string, commentId: string): Observable<void> {
    return this.rest.request<void, any>({
      method: 'DELETE',
      url: `${this.apiUrl}/comment?complaintId=${complaintId}&commentId=${commentId}`
    });
  }

  getStatusLogs(complaintId: string): Observable<PagedResult<ComplaintStatusLog>> {
    return this.rest.request<any, PagedResult<ComplaintStatusLog>>({
      method: 'GET',
      url: `${this.apiUrl}/status-logs/${complaintId}`
    });
  }

  getDashboard(): Observable<ComplaintDashboard> {
    return this.rest.request<any, ComplaintDashboard>({
      method: 'GET',
      url: `${this.apiUrl}/dashboard`
    });
  }

  getFullTraceReport(complaintId: string): Observable<FullTraceReport> {
    return this.rest.request<any, FullTraceReport>({
      method: 'GET',
      url: `${this.apiUrl}/full-trace-report/${complaintId}`
    });
  }
}
