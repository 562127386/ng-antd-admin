import { Route } from '@angular/router';

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'defects'
  },
    {
    path: 'dynamic-config',
    title: '物料管理',
    data: { key: 'materials' },
    loadComponent: () => import('../../lib/components/config/dynamic-config-list.component').then(m => m.DynamicConfigListComponent)
  },
  {
    path: 'dynamic-form',
    title: '缺陷管理',
    data: { key: 'defects' },
    loadComponent: () => import('./dynamic-form-demo/dynamic-form-demo.component').then(m => m.DynamicFormDemoComponent)
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
    path: 'quality-inspection-plans',
    title: '质检方案管理',
    data: { key: 'quality-inspection-plans' },
    loadComponent: () => import('./quality-inspection-plans/quality-inspection-plans.component').then(m => m.QualityInspectionPlansComponent)
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
    path: 'iqc-inspections-v2',
    title: '检验单',
    data: { key: 'iqc-inspections-v2' },
    loadComponent: () => import('./iqc-inspections/iqc-inspections-v2.component').then(m => m.IqcInspectionsV2Component)
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
  },
  {
    path: 'quality-reports',
    title: '质量报告',
    data: { key: 'quality-reports' },
    loadComponent: () => import('./quality-reports/quality-reports.component').then(m => m.QualityReportsComponent)
  },
  {
    path: 'quality-indicators',
    title: '质检指标',
    data: { key: 'quality-indicators' },
    loadComponent: () => import('./quality-indicators/quality-indicators.component').then(m => m.QualityIndicatorsComponent)
  }
] satisfies Route[];
