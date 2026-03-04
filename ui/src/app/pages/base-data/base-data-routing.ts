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
  },
  {
    path: 'sampling-schemes',
    title: '抽样方案配置',
    data: { key: 'sampling-schemes' },
    loadComponent: () => import('./sampling-schemes/sampling-schemes.component').then(m => m.SamplingSchemesComponent)
  },
  {
    path: 'iqc-inspections',
    title: 'IQC来料检验',
    data: { key: 'iqc-inspections' },
    loadComponent: () => import('./iqc-inspections/iqc-inspections.component').then(m => m.IqcInspectionsComponent)
  },
  {
    path: 'suppliers',
    title: '供应商管理',
    data: { key: 'suppliers' },
    loadComponent: () => import('./suppliers/suppliers.component').then(m => m.SuppliersComponent)
  },
  {
    path: 'non-conformings',
    title: '不合格品处理',
    data: { key: 'non-conformings' },
    loadComponent: () => import('./non-conformings/non-conformings.component').then(m => m.NonConformingsComponent)
  }
] satisfies Route[];
