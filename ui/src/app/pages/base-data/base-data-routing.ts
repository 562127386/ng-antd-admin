import { Route } from '@angular/router';

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'defects'
  },
  {
    path: 'defects',
    title: '缺陷管理',
    data: { key: 'defects' },
    loadComponent: () => import('./defects/defects.component').then(m => m.DefectsComponent)
  },
  {
    path: 'materials',
    title: '物料管理',
    data: { key: 'materials' },
    loadComponent: () => import('./materials/materials.component').then(m => m.MaterialsComponent)
  },
  {
    path: 'processes',
    title: '工序管理',
    data: { key: 'processes' },
    loadComponent: () => import('./processes/processes.component').then(m => m.ProcessesComponent)
  }
] satisfies Route[];
