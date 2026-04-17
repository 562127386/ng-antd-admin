import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintListComponent } from './complaint-list/complaint-list.component';
import { Complaint8DComponent } from './components/complaint-8d/complaint-8d.component';
import { ComplaintHistoryComponent } from './components/complaint-history/complaint-history.component';
import { ComplaintCommentsComponent } from './components/complaint-comments/complaint-comments.component';
import { ComplaintCostsComponent } from './components/complaint-costs/complaint-costs.component';
import { ComplaintAttachmentsComponent } from './components/complaint-attachments/complaint-attachments.component';
import { ComplaintTraceabilityComponent } from './components/complaint-traceability/complaint-traceability.component';
import { ComplaintsRoutingModule } from './complaints-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ComplaintsRoutingModule,
    ComplaintListComponent,
    Complaint8DComponent,
    ComplaintHistoryComponent,
    ComplaintCommentsComponent,
    ComplaintCostsComponent,
    ComplaintAttachmentsComponent,
    ComplaintTraceabilityComponent
  ]
})
export class ComplaintsModule {}
