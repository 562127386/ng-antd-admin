import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IqcInspectionOrderDto, CreateUpdateIqcInspectionOrderDto } from '@app/pages/base-data/models/iqc-inspection.model';
import { IqcInspectionService } from '@app/pages/base-data/services/iqc-inspection.service';
import { SamplingSchemeDto } from '@app/pages/base-data/models/sampling-scheme.model';
import { SamplingSchemeService } from '@app/pages/base-data/services/sampling-scheme.service';
import { QualityInspectionPlanSelectorComponent } from '@app/pages/base-data/components/quality-inspection-plan-selector/quality-inspection-plan-selector.component';
import { QualityInspectionPlanDto } from '@app/pages/base-data/models/quality-inspection-plan.model';
import { QualityInspectionPlanService } from '@app/pages/base-data/services/quality-inspection-plan.service';
import { MaterialSelectorComponent } from '@app/pages/base-data/components/material-selector/material-selector.component';
import { SupplierSelectorComponent } from '@app/pages/base-data/components/supplier-selector/supplier-selector.component';
import { JudgmentRulesDisplayComponent, RuleEvaluationResult } from '@app/pages/base-data/components/judgment-rules-display/judgment-rules-display.component';
import { MaterialDto } from '@app/pages/base-data/models/material.model';
import { SupplierDto } from '@app/pages/base-data/models/supplier.model';
import { InspectionStatus, InspectionResult, ItemJudgment, SamplingSchemeType } from '@app/pages/base-data/models/enums';
import { AqlConfigDto } from '@app/pages/base-data/models/aql-config.model';
import { AqlConfigService } from '@app/pages/base-data/services/aql-config.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of, forkJoin } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Disablable } from '@antv/x6';

@Component({
  selector: 'app-iqc-inspection-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzInputNumberModule,
    NzDividerModule,
    NzDescriptionsModule,
    NzAlertModule,
    NzSpinModule,
    NzCollapseModule,
    QualityInspectionPlanSelectorComponent,
    MaterialSelectorComponent,
    SupplierSelectorComponent,
    JudgmentRulesDisplayComponent
  ],
  templateUrl: './iqc-inspection-drawer.component.html',
  styleUrls: ['./iqc-inspection-drawer.component.less']
})
export class IqcInspectionDrawerComponent implements OnInit, OnDestroy {
  private iqcInspectionService = inject(IqcInspectionService);
  private samplingSchemeService = inject(SamplingSchemeService);
  private qualityInspectionPlanService = inject(QualityInspectionPlanService);
  private aqlConfigService = inject(AqlConfigService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  params: { mode: 'view' | 'edit' | 'create' | 'inspect'; id?: string } = { mode: 'create' };

  isLoading = false;
  viewingOrder?: IqcInspectionOrderDto;
  createForm!: FormGroup;
  isEdit = false;
  isViewMode = false;
  isInspectMode = false;
  selectedPlan?: QualityInspectionPlanDto;
  planStepGroups: { stepCode: string; stepName: string; indicators: any[] }[] = [];
  selectedMaterial?: MaterialDto;
  selectedSupplier?: SupplierDto;
  samplingSchemes: SamplingSchemeDto[] = [];
  isPlanSelectorVisible = false;
  isMaterialSelectorVisible = false;
  isSupplierSelectorVisible = false;
  
  selectedSamplingScheme?: SamplingSchemeDto;
  sampleSize = 0;
  aqlConfigs: AqlConfigDto[] = [];
  matchedAqlConfig?: AqlConfigDto;
  relatedAqlConfigs: AqlConfigDto[] = [];
  private destroy$ = new Subject<void>();

  recordStepGroups: { stepCode: string; stepName: string; records: any[] }[] = [];

  inspectionTreeData: any[] = [];
  sampleColumns: number[] = [];
  isSaving = false;

  statusOptions = [
    { label: '草稿', value: InspectionStatus.Draft, color: 'default' },
    { label: '待检验', value: InspectionStatus.Pending, color: 'processing' },
    { label: '检验中', value: InspectionStatus.InProgress, color: 'warning' },
    { label: '已完成', value: InspectionStatus.Completed, color: 'success' },
    { label: '已取消', value: InspectionStatus.Cancelled, color: 'error' }
  ];

  resultOptions = [
    { label: '待判定', value: 0, color: 'default' },
    { label: '合格', value: InspectionResult.Accepted, color: 'success' },
    { label: '不合格', value: InspectionResult.Rejected, color: 'error' },
    { label: '特采', value: InspectionResult.Concession, color: 'warning' },
    { label: '挑选', value: InspectionResult.Sorting, color: 'processing' }
  ];

  ngOnInit(): void {
    this.initForms();
    
    this.isViewMode = this.params.mode === 'view';
    this.isEdit = this.params.mode === 'edit';
    this.isInspectMode = this.params.mode === 'inspect';
    
    if (this.params.mode === 'view' || this.params.mode === 'edit' || this.params.mode === 'inspect') {
      this.isLoading = true;
    }
    
    if (this.params.mode === 'view' || this.params.mode === 'inspect') {
      this.loadInspectionOnly();
    } else {
      forkJoin([
        this.samplingSchemeService.getList({ isEnabled: true, maxResultCount: 1000 }),
        this.aqlConfigService.getList({ isEnabled: true, maxResultCount: 1000 })
      ]).subscribe({
        next: ([samplingResult, aqlResult]) => {
          this.samplingSchemes = samplingResult.items;
          this.aqlConfigs = aqlResult.items;
          
          if ((this.params.mode === 'view' || this.params.mode === 'edit' || this.params.mode === 'inspect') && this.params.id) {
            this.loadInspection(this.params.id);
          } else {
            this.isLoading = false;
            this.resetForm();
          }
          
          this.setupFormWatchers();
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.messageService.error('加载数据失败');
        }
      });
    }
  }

  loadInspectionOnly(): void {
    if (!this.params.id) {
      this.isLoading = false;
      return;
    }
    this.loadInspection(this.params.id);
  }

  initForms(): void {
    this.createForm = this.fb.group({
      orderNo: [{ value: '自动生成', disabled: true }, [Validators.required]],
      materialId: [null, [Validators.required]],
      materialCode: [''],
      materialName: [''],
      batchNo: ['', [Validators.required]],
      lotSize: [null, [Validators.required, Validators.min(1)]],
      supplierId: [null, [Validators.required]],
      supplierName: [''],
      purchaseOrderNo: [''],
      arrivalDate: [null, [Validators.required]],
      samplingSchemeId: [null, [Validators.required]],
      qualityInspectionPlanId: [null, [Validators.required]],
      aqlValue: [0.65],
      sampleSize: [null],
      sampleSizeCode: [{ value: '', disabled: true }],
      acceptanceNumber: [null],
      rejectionNumber: [null],
      remark: ['']
    });
    this.initValueChanges();
  }

  private initValueChanges(): void {
    this.createForm.get('lotSize')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.findBestMatchAqlConfig();
    });

    this.createForm.get('aqlValue')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.findBestMatchAqlConfig();
    });

    this.createForm.get('samplingSchemeId')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.findBestMatchAqlConfig();
    });
  }

  private findBestMatchAqlConfig(): void {
    const lotSize = this.createForm.get('lotSize')?.value;
    const aqlValue = this.createForm.get('aqlValue')?.value;
    const samplingSchemeId = this.createForm.get('samplingSchemeId')?.value;

if (samplingSchemeId === null || samplingSchemeId === undefined || samplingSchemeId === '') {
  return;
}
    if (!lotSize || !aqlValue) {
      this.matchedAqlConfig = undefined;
      this.relatedAqlConfigs = [];
      this.createForm.patchValue({
        sampleSize: null,
        sampleSizeCode: '',
        acceptanceNumber: null,
        rejectionNumber: null
      }, { emitEvent: false });
      this.cdr.markForCheck();
      return;
    }

    this.aqlConfigService.findBestMatch(samplingSchemeId, lotSize, aqlValue).subscribe({
      next: (config) => {
        this.matchedAqlConfig = config ?? undefined;
        if (config) {
          this.createForm.patchValue({
            sampleSize: config.sampleSize,
            sampleSizeCode: config.sampleSizeCode,
            acceptanceNumber: config.acceptanceNumber,
            rejectionNumber: config.rejectionNumber
          }, { emitEvent: false });
          this.relatedAqlConfigs = [config];
        } else {
          this.relatedAqlConfigs = [];
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.matchedAqlConfig = undefined;
        this.relatedAqlConfigs = [];
        this.cdr.markForCheck();
      }
    });
  }

  resetForm(): void {
    this.createForm.reset({
      orderNo: '自动生成',
      aqlValue: 0.65
    });
    this.viewingOrder = undefined;
    this.selectedPlan = undefined;
    this.selectedMaterial = undefined;
    this.selectedSupplier = undefined;
    this.matchedAqlConfig = undefined;
    this.relatedAqlConfigs = [];
    this.cdr.markForCheck();
  }

  loadInspection(id: string): void {
    this.cdr.markForCheck();
    this.iqcInspectionService.get(id).subscribe({
      next: (detail) => {
        this.viewingOrder = detail;
        this.groupRecordsByStep();
        
        if (detail.materialId && detail.materialCode && detail.materialName) {
          this.selectedMaterial = {
            id: detail.materialId,
            code: detail.materialCode,
            name: detail.materialName,
            materialType: 1,
            batchManagement: false,
            expiryManagement: false,
            isEnabled: true,
            creationTime: new Date()
          } as MaterialDto;
        } else {
          this.selectedMaterial = undefined;
        }
        
        if (detail.supplierId && detail.supplierName) {
          this.selectedSupplier = {
            id: detail.supplierId,
            code: '',
            name: detail.supplierName,
            isEnabled: true,
            sortOrder: 0,
            creationTime: new Date()
          } as SupplierDto;
        } else {
          this.selectedSupplier = undefined;
        }
        
        if (this.params.mode === 'edit' && detail.qualityInspectionPlanId) {
          this.loadQualityInspectionPlan(detail.qualityInspectionPlanId);
        } else {
          this.selectedPlan = undefined;
        }

        if (this.params.mode === 'edit') {
          this.createForm.patchValue({
            orderNo: detail.orderNo,
            materialId: detail.materialId,
            materialCode: detail.materialCode,
            materialName: detail.materialName,
            batchNo: detail.batchNo,
            lotSize: detail.lotSize,
            supplierId: detail.supplierId,
            supplierName: detail.supplierName,
            purchaseOrderNo: detail.purchaseOrderNo,
            arrivalDate: detail.arrivalDate ? new Date(detail.arrivalDate) : null,
            qualityInspectionPlanId: detail.qualityInspectionPlanId,
            samplingSchemeId: detail.samplingSchemeId,
            aqlValue: detail.aqlValue,
            sampleSize: detail.sampleSize,
            sampleSizeCode: detail.sampleSizeCode || '',
            acceptanceNumber: detail.acceptanceNumber,
            rejectionNumber: detail.rejectionNumber,
            remark: detail.remark
          });
          
          this.updateSamplingInfo();
          
        }

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.messageService.error('加载检验单失败');
        this.cdr.markForCheck();
      }
    });
  }

  loadQualityInspectionPlan(id: string): void {
    this.qualityInspectionPlanService.get(id).subscribe({
      next: (plan) => {
        this.selectedPlan = plan;
        this.groupPlanSteps();
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.error('加载质检方案失败');
        this.selectedPlan = undefined;
        this.cdr.markForCheck();
      }
    });
  }

  loadSamplingSchemes(): void {
    this.samplingSchemeService.getList({ isEnabled: true, maxResultCount: 1000 }).subscribe({
      next: (result) => {
        this.samplingSchemes = result.items;
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.error('加载抽样方案失败');
      }
    });
  }

  loadAqlConfigs(): void {
    this.aqlConfigService.getList({ isEnabled: true, maxResultCount: 1000 }).subscribe({
      next: (result) => {
        this.aqlConfigs = result.items;
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.error('加载AQL配置失败');
      }
    });
  }

  getSamplingSchemeName(schemeId?: string): string {
    if (!schemeId) return '-';
    const scheme = this.samplingSchemes.find(s => s.id === schemeId);
    return scheme ? scheme.name : '-';
  }

  getSelectedSamplingSchemeName(): string {
    const schemeId = this.createForm.get('samplingSchemeId')?.value;
    if (!schemeId) return '';
    const scheme = this.samplingSchemes.find(s => s.id === schemeId);
    return scheme ? scheme.name : '';
  }

  groupRecordsByStep(): void {
    this.recordStepGroups = [];
    if (!this.viewingOrder?.records || this.viewingOrder.records.length === 0) {
      return;
    }

    const groups = new Map<string, { stepCode: string; stepName: string; records: any[] }>();
    
    for (const record of this.viewingOrder.records) {
      const key = record.stepCode || record.stepName || '未分组';
      if (!groups.has(key)) {
        groups.set(key, {
          stepCode: record.stepCode || '',
          stepName: record.stepName || '未分组',
          records: []
        });
      }
      groups.get(key)!.records.push(record);
    }

    this.recordStepGroups = Array.from(groups.values());
    this.buildInspectionTreeData();
  }

  buildInspectionTreeData(): void {
    this.inspectionTreeData = [];
    if (!this.viewingOrder?.records || this.viewingOrder.records.length === 0) {
      return;
    }

    const sampleSize = this.viewingOrder.sampleSize || this.sampleSize || 0;
    this.sampleColumns = Array.from({ length: sampleSize }, (_, i) => i + 1);

    const groups = new Map<string, { stepCode: string; stepName: string; records: any[] }>();
    
    for (const record of this.viewingOrder.records) {
      const key = record.stepCode || record.stepName || '未分组';
      if (!groups.has(key)) {
        groups.set(key, {
          stepCode: record.stepCode || '',
          stepName: record.stepName || '未分组',
          records: []
        });
      }
      groups.get(key)!.records.push(record);
    }

    for (const group of groups.values()) {
      const stepNode = {
        key: group.stepCode || group.stepName,
        title: group.stepName,
        stepCode: group.stepCode,
        stepName: group.stepName,
        isLeaf: false,
        expand: true,
        children: group.records.map((record, idx) => ({
          key: `${group.stepCode || group.stepName}-${record.inspectionItemId || idx}`,
          title: record.itemName,
          itemCode: record.itemCode,
          itemName: record.itemName,
          inspectionItemId: record.inspectionItemId,
          originalRulesJson: record.originalRulesJson,
          isLeaf: true,
          record: record,
          samples: record.samples?.length ? record.samples : this.initSamplesForRecord(record) // record.samples || this.initSamplesForRecord(record)
        }))
      };
      this.inspectionTreeData.push(stepNode);
    }
  }

  initSamplesForRecord(record: any): any[] {
    return this.sampleColumns.map(no => ({
      sampleNo: no,
      sampleName: `样品${no}`,
      sampleValue: '',
      judgment: ItemJudgment.Pending,
      //isPassed: true
    }));
  }

  async evaluateSampleValue(sample: any, rulesJson: string | null): Promise<void> {
    if (!sample.sampleValue || !rulesJson) {
      //sample.isPassed = true;
      sample.judgment = ItemJudgment.Pending;
      return;
    }

    try {
      const results = await this.iqcInspectionService.evaluateRule(rulesJson, sample.sampleValue).toPromise();
      // if (results && results.length > 0) {
      //   const allPassed = results.every((r: any) => r.isPassed);
      //   sample.isPassed = allPassed;
      //   sample.judgment = allPassed ? ItemJudgment.OK : ItemJudgment.NG;
      // } else {
      //   sample.isPassed = true;
      // }


      if (results && results.length > 0) {
            //const allPassed = results.every((r: any) => (r.isPassed || r.IsPassed) && r.JudgmentResult ==="不合格");
            const allPassed = results.some((r: any) => {
                // 兼容大小写字段，强制转布尔
                const isPassed = !!r.isPassed || !!r.IsPassed;
                // 兼容大小写字段 + 去空格 + 转字符串
                const judgmentResult = String(r.JudgmentResult || r.judgmentResult || '').trim();
                // 条件：通过 并且 是不合格/NG
                return isPassed && (judgmentResult === "不合格" || judgmentResult === "NG");
            });
            if(allPassed)
            {
              //sample.isPassed= false;
              sample.judgment = ItemJudgment.NG;// 有一个条件触发不合格 就不合格
            }
            else //
            {
                const okPassed = results.some((r: any) => {
                      // 统一取 isPassed（兼容大小写、空值）
                      const isPassed = !!r.isPassed || !!r.IsPassed;
                      // 统一取结果（兼容大小写、空值、去空格、转字符串）
                      const judgmentResult = String(r.JudgmentResult || r.judgmentResult || '').trim();
                      // 核心条件：必须全部满足
                      return isPassed && (judgmentResult === '合格' || judgmentResult === 'OK');
                });
                if(okPassed)
                  {
                    //sample.isPassed= true;
                    sample.judgment = ItemJudgment.OK;// 有一个条件触发合格 就合格
                  }
                else 
                  {
                    //sample.isPassed= true;
                    sample.judgment = ItemJudgment.Pending;//带判定
                  }
            } 
      }



    } catch {
      //sample.isPassed = true;
      sample.judgment = ItemJudgment.Pending;//带判定
    }
    this.cdr.markForCheck();
  }

  async saveAllRecords(): Promise<void> {
    if (!this.viewingOrder?.id) return;

    const records = this.inspectionTreeData
      .filter((step: any) => step.children)
      .flatMap((step: any) => step.children.map((child: any) => ({
        inspectionItemId: child.inspectionItemId || '',
        stepCode: step.stepCode || '',
        stepName: step.stepName || '',
        itemCode: child.itemCode || '',
        itemName: child.itemName || '',
        judgment: this.calculateRecordJudgment(child.samples),
        defectDescription: child.record?.defectDescription || '',
        improvementDescription: child.record?.improvementDescription || '',
        remark: child.record?.remark || '',
        samples: child.samples.map((s: any) => ({
          sampleNo: s.sampleNo,
          sampleName: s.sampleName,
          sampleValue: s.sampleValue,
          judgment: s.judgment,
          defectCode: s.defectCode || '',
          defectDescription: s.defectDescription || '',
          remark: s.remark || ''
        }))
      })));

    const input = {
      orderId: this.viewingOrder.id,
      records
    };

    this.isSaving = true;
    this.iqcInspectionService.saveAllRecords(input).subscribe({
      next: () => {
        this.isSaving = false;
        this.messageService.success('保存成功');
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSaving = false;
        this.messageService.error('保存失败');
        this.cdr.markForCheck();
      }
    });
  }

  calculateRecordJudgment(samples: any[]): number {
    if (!samples || samples.length === 0) return ItemJudgment.Pending;
    const hasNG = samples.some(s => s.judgment === ItemJudgment.NG);
    return hasNG ? ItemJudgment.NG : ItemJudgment.OK;
  }

  hasNG(samples: any[]): boolean {
    if (!samples || samples.length === 0) return false;
    return samples.some(s => s.judgment === ItemJudgment.NG);
  }

  allOK(samples: any[]): boolean {
    if (!samples || samples.length === 0) return false;
    return samples.length > 0 && samples.every(s => s.judgment === ItemJudgment.OK);
  }

  onSampleValueChange(child: any, sample: any): void {
    this.evaluateSampleValue(sample, child.originalRulesJson);
  }

  onSampleBlur(child: any, sample: any): void {
    this.evaluateSampleValue(sample, child.originalRulesJson);
  }

  getJudgmentText(judgment?: number): string {
    if (judgment === undefined || judgment === null) return '待判定';
    switch (judgment) {
      case ItemJudgment.Pending: return '待判定';
      case ItemJudgment.OK: return '合格';
      case ItemJudgment.NG: return '不合格';
      default: return '待判定';
    }
  }

  getJudgmentColor(judgment?: number): string {
    if (judgment === undefined || judgment === null) return 'default';
    switch (judgment) {
      case ItemJudgment.OK: return 'success';
      case ItemJudgment.NG: return 'error';
      default: return 'default';
    }
  }

  getSampleJudgmentColor(judgment?: number): string {
    if (judgment === undefined || judgment === null) return 'default';
    switch (judgment) {
      case ItemJudgment.OK: return 'success';
      case ItemJudgment.NG: return 'error';
      default: return 'default';
    }
  }

  getSampleJudgmentText(judgment?: number): string {
    if (judgment === undefined || judgment === null) return '待判定';
    switch (judgment) {
      case ItemJudgment.OK: return 'OK';
      case ItemJudgment.NG: return 'NG';
      default: return '待判定';
    }
  }

  parseRuleEvaluationResult(json?: string): RuleEvaluationResult[] {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }

  getStatusText(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : '';
  }

  getStatusColor(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.color : 'default';
  }

  getResultText(result?: number): string {
    if (result === undefined || result === null) return '';
    const option = this.resultOptions.find(o => o.value === result);
    return option ? option.label : '';
  }

  getResultColor(result?: number): string {
    if (result === undefined || result === null) return 'default';
    const option = this.resultOptions.find(o => o.value === result);
    return option ? option.color : 'default';
  }

  get SchemeType() {
    return SamplingSchemeType;
  }

  get isAqlScheme(): boolean {
    return this.selectedSamplingScheme?.schemeType === SamplingSchemeType.AQL;
  }

  get noMatchReason(): string {
    const lotSize = this.createForm.get('lotSize')?.value;
    if (!lotSize || !this.relatedAqlConfigs.length) {
      return '';
    }
    
    const hasSmaller = this.relatedAqlConfigs.some(c => lotSize < c.minLotSize);
    const hasLarger = this.relatedAqlConfigs.some(c => lotSize > c.maxLotSize);
    
    if (hasSmaller && hasLarger) {
      return `当前批量 ${lotSize} 不在任何配置的范围内，请调整批量或检查AQL配置。`;
    } else if (hasSmaller) {
      return `当前批量 ${lotSize} 太小，最小批量要求为 ${Math.min(...this.relatedAqlConfigs.map(c => c.minLotSize))}。`;
    } else if (hasLarger) {
      return `当前批量 ${lotSize} 太大，最大批量限制为 ${Math.max(...this.relatedAqlConfigs.map(c => c.maxLotSize))}。`;
    }
    return '未找到匹配的AQL配置。';
  }

  isPotentialMatch(config: AqlConfigDto): boolean {
    const lotSize = this.createForm.get('lotSize')?.value;
    if (!lotSize) return false;
    
    const diffBelow = lotSize - config.maxLotSize;
    const diffAbove = config.minLotSize - lotSize;
    
    if (lotSize < config.minLotSize && diffAbove <= 50) return true;
    if (lotSize > config.maxLotSize && diffBelow <= 50) return true;
    
    return false;
  }

  getSchemeTypeText(schemeType: number): string {
    switch (schemeType) {
      case SamplingSchemeType.AQL:
        return 'AQL抽样';
      case SamplingSchemeType.CZero:
        return 'C=0抽样';
      case SamplingSchemeType.Variable:
        return '计量抽样';
      case SamplingSchemeType.Continuous:
        return '连续抽样';
      case SamplingSchemeType.SkipLot:
        return '跳批抽样';
      default:
        return '未知类型';
    }
  }

  setupFormWatchers(): void {
    this.createForm.get('samplingSchemeId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((schemeId) => {
        this.updateSamplingInfo();
      });

    this.createForm.get('lotSize')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateSamplingInfo();
      });
  }

  updateSamplingInfo(): void {
    const schemeId = this.createForm.get('samplingSchemeId')?.value;
    const lotSize = this.createForm.get('lotSize')?.value;
    
    if (!this.samplingSchemes.length || !this.aqlConfigs.length) {
      return;
    }
    
    if (schemeId) {
      this.selectedSamplingScheme = this.samplingSchemes.find(s => s.id === schemeId);
    } else {
      this.selectedSamplingScheme = undefined;
    }
    
    this.calculateSampleSize(lotSize);
    this.cdr.markForCheck();
  }

  calculateSampleSize(lotSize?: number): void {
    if (!this.selectedSamplingScheme || !lotSize) {
      this.sampleSize = 0;
      this.matchedAqlConfig = undefined;
      this.relatedAqlConfigs = [];
      this.createForm.patchValue({
       // aqlValue: null,   这个不用清空
        sampleSize: null,
        sampleSizeCode: '',
        acceptanceNumber: null,
        rejectionNumber: null
      });
      return;
    }

    const scheme = this.selectedSamplingScheme;
    
    if (scheme.schemeType === SamplingSchemeType.AQL && scheme.aqlConfigId) {
      this.relatedAqlConfigs = this.aqlConfigs.filter(config => config.id === scheme.aqlConfigId);
      this.matchedAqlConfig = this.findMatchingAqlConfig(scheme.aqlConfigId, lotSize);
      if (this.matchedAqlConfig) {
        this.sampleSize = this.matchedAqlConfig.sampleSize;
        this.createForm.patchValue({
          aqlValue: this.matchedAqlConfig.aqlValue,
          sampleSize: this.matchedAqlConfig.sampleSize,
          sampleSizeCode: this.matchedAqlConfig.sampleSizeCode,
          acceptanceNumber: this.matchedAqlConfig.acceptanceNumber,
          rejectionNumber: this.matchedAqlConfig.rejectionNumber
        });
      } else {
        this.sampleSize = 0;
        this.createForm.patchValue({
         // aqlValue: null,  这个不用清空
          sampleSize: null,
          sampleSizeCode: '',
          acceptanceNumber: null,
          rejectionNumber: null
        });
      }
    } else if (scheme.schemeType === SamplingSchemeType.AQL) {
      
      const aqlValue = this.createForm.get('aqlValue')?.value; 
      this.aqlConfigService.findBestMatch(scheme.id, lotSize,aqlValue).subscribe({
        next: (matchedConfig) => {
          if (matchedConfig) {
            this.matchedAqlConfig = matchedConfig;
            this.sampleSize = matchedConfig.sampleSize;
            this.relatedAqlConfigs = [matchedConfig];
            this.createForm.patchValue({
              aqlValue: matchedConfig.aqlValue,
              sampleSize: matchedConfig.sampleSize,
              sampleSizeCode: matchedConfig.sampleSizeCode,
              acceptanceNumber: matchedConfig.acceptanceNumber,
              rejectionNumber: matchedConfig.rejectionNumber
            });
          } else {
            this.matchedAqlConfig = undefined;
            this.relatedAqlConfigs = [];
            this.sampleSize = 0;
            this.createForm.patchValue({
              // aqlValue: null,  这个不用清空
              sampleSize: null,
              sampleSizeCode: '',
              acceptanceNumber: null,
              rejectionNumber: null
            });
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.matchedAqlConfig = undefined;
          this.relatedAqlConfigs = [];
          this.sampleSize = 0;
          this.createForm.patchValue({
            // aqlValue: null,  这个不用清空
            sampleSize: null,
            sampleSizeCode: '',
            acceptanceNumber: null,
            rejectionNumber: null
          });
          this.cdr.markForCheck();
        }
      });
    } else {
      this.relatedAqlConfigs = [];
      this.matchedAqlConfig = undefined;
      
      if (scheme.schemeType === SamplingSchemeType.CZero) {// && scheme.fixedSampleSize
        this.sampleSize = scheme.fixedSampleSize ?? lotSize;// C=0 抽样  就是有一个不合格就不合格，如果方案没配置样本数就是当前输入的批量
        this.createForm.patchValue({
          // aqlValue: null,  这个不用清空
          sampleSize: this.sampleSize,//scheme.fixedSampleSize,
          sampleSizeCode: '',
          acceptanceNumber: scheme.acceptanceNumber,
          rejectionNumber: scheme.rejectionNumber
        });
      } else if (scheme.schemeType === SamplingSchemeType.Continuous && scheme.samplePercentage) {
        this.sampleSize = Math.ceil(lotSize * scheme.samplePercentage / 100);
        this.createForm.patchValue({
          // aqlValue: null,  这个不用清空
          sampleSize: this.sampleSize,
          sampleSizeCode: '',
          acceptanceNumber: null,
          rejectionNumber: null
        });
      } else if (scheme.fixedSampleSize) {
        this.sampleSize = scheme.fixedSampleSize;
        this.createForm.patchValue({
          // aqlValue: null,  这个不用清空
          sampleSize: scheme.fixedSampleSize,
          sampleSizeCode: '',
          acceptanceNumber: scheme.acceptanceNumber,
          rejectionNumber: scheme.rejectionNumber
        });
      } else if (scheme.samplePercentage) {
        this.sampleSize = Math.ceil(lotSize * scheme.samplePercentage / 100);
        this.createForm.patchValue({
          // aqlValue: null,  这个不用清空
          sampleSize: this.sampleSize,
          sampleSizeCode: '',
          acceptanceNumber: null,
          rejectionNumber: null
        });
      } else {
        this.sampleSize = 0;
        this.createForm.patchValue({
          // aqlValue: null,  这个不用清空
          sampleSize: null,
          sampleSizeCode: '',
          acceptanceNumber: null,
          rejectionNumber: null
        });
      }
    }
  }

  findMatchingAqlConfig(aqlConfigId: string, lotSize: number): AqlConfigDto | undefined {
    return this.aqlConfigs.find(config => {
      if (config.id !== aqlConfigId) return false;
      if (lotSize < config.minLotSize) return false;
      if (lotSize > config.maxLotSize) return false;
      return true;
    });
  }

  getInspectionLevelText(level: number): string {
    const options = [
      { label: 'S-1', value: 1 },
      { label: 'S-2', value: 2 },
      { label: 'S-3', value: 3 },
      { label: 'S-4', value: 4 },
      { label: 'I', value: 5 },
      { label: 'II', value: 6 },
      { label: 'III', value: 7 }
    ];
    const option = options.find(o => o.value === level);
    return option ? option.label : '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openPlanSelector(): void {
    this.isPlanSelectorVisible = true;
  }

  onPlanSelected(plan: QualityInspectionPlanDto): void {
    this.selectedPlan = plan;
    this.createForm.patchValue({
      qualityInspectionPlanId: plan.id
    });
    this.groupPlanSteps();
    this.cdr.markForCheck();
  }

  groupPlanSteps(): void {
    this.planStepGroups = [];
    if (!this.selectedPlan?.steps || this.selectedPlan.steps.length === 0) {
      return;
    }

    for (const step of this.selectedPlan.steps.sort((a, b) => a.sortOrder - b.sortOrder)) {////升序
      const stepAny = step as any;
      const indicators = stepAny.items || stepAny.indicators || [];
      if (indicators.length > 0) {
        this.planStepGroups.push({
          stepCode: step.code || '',
          stepName: step.name || step.code || '未命名步骤',
          indicators: indicators
        });
      }
    }
  }

  // 升序排序方法（按指定字段）
  getSortedStepList() {
    // slice() 复制数组，避免修改原数组
    return this.recordStepGroups.slice().sort((a, b) => {
      // 数字字段升序：a.字段 - b.字段
      //return a.id - b.id; 
      
      // 字符串字段升序（比如name）：
       return a.stepName.localeCompare(b.stepName);
    });
  }

  clearPlan(): void {
    this.selectedPlan = undefined;
    this.planStepGroups = [];
    this.createForm.patchValue({
      qualityInspectionPlanId: null
    });
    this.cdr.markForCheck();
  }

  openMaterialSelector(): void {
    this.isMaterialSelectorVisible = true;
  }

  onMaterialSelected(material: MaterialDto): void {
    this.selectedMaterial = material;
    this.createForm.patchValue({
      materialId: material.id,
      materialCode: material.code,
      materialName: material.name
    });
    this.cdr.markForCheck();
  }

  clearMaterial(): void {
    this.selectedMaterial = undefined;
    this.createForm.patchValue({
      materialId: null,
      materialCode: '',
      materialName: ''
    });
  }

  openSupplierSelector(): void {
    this.isSupplierSelectorVisible = true;
  }

  onSupplierSelected(supplier: SupplierDto): void {
    this.selectedSupplier = supplier;
    this.createForm.patchValue({
      supplierId: supplier.id,
      supplierName: supplier.name
    });
    this.cdr.markForCheck();
  }

  clearSupplier(): void {
    this.selectedSupplier = undefined;
    this.createForm.patchValue({
      supplierId: null,
      supplierName: ''
    });
  }

  onActualValueChange(record: any): void {
    this.cdr.markForCheck();
  }

  autoJudge(record: any): void {
    if (!record.actualValue) {
      return;
    }

    const actualValue = parseFloat(record.actualValue);
    if (isNaN(actualValue)) {
      return;
    }

    const hasUsl = record.usl !== null && record.usl !== undefined && record.usl !== '';
    const hasLsl = record.lsl !== null && record.lsl !== undefined && record.lsl !== '';
    const hasUcl = record.ucl !== null && record.ucl !== undefined && record.ucl !== '';
    const hasLcl = record.lcl !== null && record.lcl !== undefined && record.lcl !== '';
    const hasStandardValue = record.standardValue !== null && record.standardValue !== undefined && record.standardValue !== '';

    let isOutOfRange = false;
    let hasAnySpec = false;

    if (hasUsl) {
      hasAnySpec = true;
      const usl = parseFloat(record.usl);
      if (!isNaN(usl) && actualValue > usl) {
        isOutOfRange = true;
      }
    }

    if (hasLsl) {
      hasAnySpec = true;
      const lsl = parseFloat(record.lsl);
      if (!isNaN(lsl) && actualValue < lsl) {
        isOutOfRange = true;
      }
    }

    if (hasUcl) {
      hasAnySpec = true;
      const ucl = parseFloat(record.ucl);
      if (!isNaN(ucl) && actualValue > ucl) {
        isOutOfRange = true;
      }
    }

    if (hasLcl) {
      hasAnySpec = true;
      const lcl = parseFloat(record.lcl);
      if (!isNaN(lcl) && actualValue < lcl) {
        isOutOfRange = true;
      }
    }

    if (!hasAnySpec && hasStandardValue) {
      hasAnySpec = true;
      const standardValue = parseFloat(record.standardValue);
      if (!isNaN(standardValue)) {
        isOutOfRange = actualValue !== standardValue;
      }
    }

    if (isOutOfRange) {
      record.judgment = ItemJudgment.NG;
    } else if (hasAnySpec) {
      record.judgment = ItemJudgment.OK;
    }

    this.cdr.markForCheck();
  }

  isValueOutOfRange(record: any): boolean {
    if (!record.actualValue) {
      return false;
    }

    if (record.originalRulesJson) {
      const results = this.parseRuleEvaluationResult(record.originalRulesJson);
      if (results && results.length > 0) {
        const allRulesFailed = results.every((r: any) => !(r.isPassed || r.IsPassed));
        if (allRulesFailed) {
          return true;
        }
      }
    }

    const actualValue = parseFloat(record.actualValue);
    if (isNaN(actualValue)) {
      return false;
    }

    const hasUsl = record.usl !== null && record.usl !== undefined && record.usl !== '';
    const hasLsl = record.lsl !== null && record.lsl !== undefined && record.lsl !== '';
    const hasUcl = record.ucl !== null && record.ucl !== undefined && record.ucl !== '';
    const hasLcl = record.lcl !== null && record.lcl !== undefined && record.lcl !== '';
    const hasStandardValue = record.standardValue !== null && record.standardValue !== undefined && record.standardValue !== '';

    if (hasUsl) {
      const usl = parseFloat(record.usl);
      if (!isNaN(usl) && actualValue > usl) {
        return true;
      }
    }

    if (hasLsl) {
      const lsl = parseFloat(record.lsl);
      if (!isNaN(lsl) && actualValue < lsl) {
        return true;
      }
    }

    if (hasUcl) {
      const ucl = parseFloat(record.ucl);
      if (!isNaN(ucl) && actualValue > ucl) {
        return true;
      }
    }

    if (hasLcl) {
      const lcl = parseFloat(record.lcl);
      if (!isNaN(lcl) && actualValue < lcl) {
        return true;
      }
    }

    if (!hasUsl && !hasLsl && !hasUcl && !hasLcl && hasStandardValue) {
      const standardValue = parseFloat(record.standardValue);
      if (!isNaN(standardValue)) {
        return actualValue !== standardValue;
      }
    }

    return false;
  }

  isValueInRange(record: any): boolean {
    if (!record.actualValue) {
      return false;
    }

    const actualValue = parseFloat(record.actualValue);
    if (isNaN(actualValue)) {
      return false;
    }

    const hasUsl = record.usl !== null && record.usl !== undefined && record.usl !== '';
    const hasLsl = record.lsl !== null && record.lsl !== undefined && record.lsl !== '';
    const hasUcl = record.ucl !== null && record.ucl !== undefined && record.ucl !== '';
    const hasLcl = record.lcl !== null && record.lcl !== undefined && record.lcl !== '';
    const hasStandardValue = record.standardValue !== null && record.standardValue !== undefined && record.standardValue !== '';

    if (!hasUsl && !hasLsl && !hasUcl && !hasLcl && !hasStandardValue) {
      return false;
    }

    return !this.isValueOutOfRange(record);
  }

  onJudgmentChange(record: any): void {
    this.cdr.markForCheck();
  }

  evaluateRule(record: any): void {
    if (!this.viewingOrder?.id) {
      return;
    }

    if (record.actualValue && record.originalRulesJson) {
      this.iqcInspectionService.evaluateRule(record.originalRulesJson, record.actualValue).subscribe({
        next: (results) => {
          if (results && results.length > 0) {
            //const allPassed = results.every((r: any) => (r.isPassed || r.IsPassed) && r.JudgmentResult ==="不合格");
            const allPassed = results.some((r: any) => {
    // 兼容大小写字段，强制转布尔
    const isPassed = !!r.isPassed || !!r.IsPassed;
    // 兼容大小写字段 + 去空格 + 转字符串
    const judgmentResult = String(r.JudgmentResult || r.judgmentResult || '').trim();
    // 条件：通过 并且 是不合格/NG
    return isPassed && (judgmentResult === "不合格" || judgmentResult === "NG");
});
            if(allPassed)record.judgment = ItemJudgment.NG;// 有一个条件触发不合格 就不合格
            else //
            {
                const okPassed = results.some((r: any) => {
                  // 统一取 isPassed（兼容大小写、空值）
                  const isPassed = !!r.isPassed || !!r.IsPassed;
                  // 统一取结果（兼容大小写、空值、去空格、转字符串）
                  const judgmentResult = String(r.JudgmentResult || r.judgmentResult || '').trim();
                  // 核心条件：必须全部满足
                  return isPassed && (judgmentResult === '合格' || judgmentResult === 'OK');
                });
                if(okPassed)record.judgment = ItemJudgment.OK;// 有一个条件触发合格 就合格
                else record.judgment = ItemJudgment.Pending;//带判定
            }
            
            record.ruleEvaluationResultJson = JSON.stringify(results);
          }
          //this.saveRecord(record); 先不保存
            this.cdr.markForCheck();
        },
        error: () => {
          this.messageService.error('规则评估失败');
        }
      });
    } else {
      //this.saveRecord(record); 先不保存
    }
  }

  saveRecord(record: any): void {
    if (!this.viewingOrder?.id) {
      return;
    }

    if (record.judgment === 2 && !record.defectDescription) {
      this.messageService.error('判定为不合格时，缺陷描述不能为空');
      return;
    }

    const updateInput: any = {
      inspectionItemId: record.inspectionItemId,
      itemCode: record.itemCode,
      itemName: record.itemName,
      standardValue: record.standardValue,
      usl: record.usl,
      ucl: record.ucl,
      lcl: record.lcl,
      lsl: record.lsl,
      actualValue: record.actualValue,
      judgment: record.judgment,
      defectId: record.defectId,
      defectCode: record.defectCode,
      defectDescription: record.defectDescription,
      defectCount: record.defectCount || 0,
      improvementDescription: record.improvementDescription,
      remark: record.remark
    };

    this.iqcInspectionService.updateInspectionRecord(this.viewingOrder!.id, record.id, updateInput).subscribe({
      next: () => {
        this.messageService.success('保存成功');
      },
      error: () => {
        this.messageService.error('保存失败');
      }
    });
  }

  getCurrentValue(): Observable<NzSafeAny> {
    if (this.isViewMode || this.isInspectMode) {
      return of(true);
    }

    if (this.createForm.invalid) {
      Object.values(this.createForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return of(false);
    }

    const formValue = {
      ...this.createForm.value,
      samplingSchemeName: this.getSelectedSamplingSchemeName()
    };

    if (this.isEdit && this.params.id) {
      return new Observable(subscriber => {
        this.iqcInspectionService.update(this.params.id!, formValue).subscribe({
          next: () => {
            this.messageService.success('更新成功');
            subscriber.next(true);
            subscriber.complete();
          },
          error: (err) => {
            console.error('Update error:', err);
            this.messageService.error('更新失败');
            subscriber.next(false);
            subscriber.complete();
          }
        });
      });
    } else {
      return new Observable(subscriber => {
        this.iqcInspectionService.create(formValue).subscribe({
          next: (result) => {
            this.messageService.success('创建成功');
            this.viewingOrder = result;
            this.recordStepGroups = [];
            this.groupRecordsByStep();
            this.cdr.markForCheck();
            subscriber.next(true);
            subscriber.complete();
          },
          error: (err) => {
            console.error('Create error:', err);
            this.messageService.error('创建失败');
            subscriber.next(false);
            subscriber.complete();
          }
        });
      });
    }
  }
}
