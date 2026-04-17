import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplaintListComponent } from './complaint-list/complaint-list.component';

const routes: Routes = [
  {
    path: '',
    title: '客诉管理',
    data: { key: 'complaints' },
    component: ComplaintListComponent
  },
  {
    path: 'complaint-list',
    title: '客诉管理',
    data: { key: 'complaint-list' },
    loadComponent: () => import('./complaint-list/complaint-list.component').then(m => m.ComplaintListComponent)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintsRoutingModule {}
