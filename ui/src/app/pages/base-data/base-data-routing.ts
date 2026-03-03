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
  },
  {
    path: 'inspection-standards',
    title: '检验标准管理',
    data: { key: 'inspection-standards' },
    loadComponent: () => import('./inspection-standards/inspection-standards.component').then(m => m.InspectionStandardsComponent)
  },
  {
    path: 'aql-configs',
    title: 'AQL配置管理',
    data: { key: 'aql-configs' },
    loadComponent: () => import('./aql-configs/aql-configs.component').then(m => m.AqlConfigsComponent)
  }
] satisfies Route[];
