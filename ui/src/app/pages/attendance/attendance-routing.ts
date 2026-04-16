import { Routes } from '@angular/router';
import { AttendanceRuleComponent } from './attendance-rule.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'attendance'
  },
  {
    path: 'records',
    title: '考勤记录',
    data: { key: 'records' },
    loadComponent: () => import('../base-data/dynamic-form-demo/dynamic-form-demo.component').then(m => m.DynamicFormDemoComponent)
  },
  {
    path: 'attendance-rules',
    component: AttendanceRuleComponent
  }
];

export default routes;
