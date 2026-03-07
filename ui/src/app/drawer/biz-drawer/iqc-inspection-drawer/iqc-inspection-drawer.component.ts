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
import { Subject, takeUntil } from 'rxjs';
import { IqcInspectionOrderDto, CreateUpdateIqcInspectionOrderDto } from '@app/pages/base-data/models/iqc-inspection.model';
import { IqcInspectionService } from '@app/pages/base-data/services/iqc-inspection.service';
import { SamplingSchemeDto } from '@app/pages/base-data/models/sampling-scheme.model';
import { SamplingSchemeService } from '@app/pages/base-data/services/sampling-scheme.service';
import { InspectionStandardSelectorComponent } from '@app/pages/base-data/components/inspection-standard-selector/inspection-standard-selector.component';
import { InspectionStandardDto } from '@app/pages/base-data/models/inspection-standard.model';
import { InspectionStandardService } from '@app/pages/base-data/services/inspection-standard.service';
import { MaterialSelectorComponent } from '@app/pages/base-data/components/material-selector/material-selector.component';
import { SupplierSelectorComponent } from '@app/pages/base-data/components/supplier-selector/supplier-selector.component';
import { MaterialDto } from '@app/pages/base-data/models/material.model';
import { SupplierDto } from '@app/pages/base-data/models/supplier.model';
import { InspectionStatus, InspectionResult, ItemJudgment, SamplingSchemeType } from '@app/pages/base-data/models/enums';
import { AqlConfigDto } from '@app/pages/base-data/models/aql-config.model';
import { AqlConfigService } from '@app/pages/base-data/services/aql-config.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of, forkJoin } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

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
    InspectionStandardSelectorComponent,
    MaterialSelectorComponent,
    SupplierSelectorComponent
  ],
  templateUrl: './iqc-inspection-drawer.component.html',
  styleUrls: ['./iqc-inspection-drawer.component.less']
})
export class IqcInspectionDrawerComponent implements OnInit, OnDestroy {
  private iqcInspectionService = inject(IqcInspectionService);
  private samplingSchemeService = inject(SamplingSchemeService);
  private inspectionStandardService = inject(InspectionStandardService);
  private aqlConfigService = inject(AqlConfigService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  params: { mode: 'view' | 'edit' | 'create' | 'inspect'; id?: string } = { mode: 'create' };

  loading = false;
  viewingOrder?: IqcInspectionOrderDto;
  createForm!: FormGroup;
  isEdit = false;
  isViewMode = false;
  isInspectMode = false;
  inspectLoading = false;
  selectedStandard?: InspectionStandardDto;
  selectedMaterial?: MaterialDto;
  selectedSupplier?: SupplierDto;
  samplingSchemes: SamplingSchemeDto[] = [];
  isStandardSelectorVisible = false;
  isMaterialSelectorVisible = false;
  isSupplierSelectorVisible = false;
  
  selectedSamplingScheme?: SamplingSchemeDto;
  sampleSize = 0;
  aqlConfigs: AqlConfigDto[] = [];
  matchedAqlConfig?: AqlConfigDto;
  relatedAqlConfigs: AqlConfigDto[] = [];
  private destroy$ = new Subject<void>();

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
    { label: '特采', value: InspectionResult.Concession, color: 'warning' }
  ];

  ngOnInit(): void {
    this.initForms();
    
    this.isViewMode = this.params.mode === 'view';
    this.isEdit = this.params.mode === 'edit';
    this.isInspectMode = this.params.mode === 'inspect';
    
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
          this.resetForm();
        }
        
        this.setupFormWatchers();
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.error('加载数据失败');
      }
    });
  }

  initForms(): void {
    this.createForm = this.fb.group({
      orderNo: ['', [Validators.required]],
      materialId: [null, [Validators.required]],
      materialCode: [''],
      materialName: [''],
      batchNo: ['', [Validators.required]],
      lotSize: [null, [Validators.required, Validators.min(1)]],
      supplierId: [null, [Validators.required]],
      supplierName: [''],
      purchaseOrderNo: [''],
      arrivalDate: [null, [Validators.required]],
      samplingSchemeId: [null],
      inspectionStandardId: [null],
      remark: ['']
    });
  }

  resetForm(): void {
    this.createForm.reset();
    this.viewingOrder = undefined;
    this.selectedStandard = undefined;
    this.selectedMaterial = undefined;
    this.selectedSupplier = undefined;
    this.cdr.markForCheck();
  }

  loadInspection(id: string): void {
    if (this.isInspectMode) {
      this.inspectLoading = true;
    } else {
      this.loading = true;
    }
    this.cdr.markForCheck();
    this.iqcInspectionService.get(id).subscribe({
      next: (detail) => {
        this.viewingOrder = detail;
        
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
        
        if (detail.inspectionStandardId) {
          this.loadInspectionStandard(detail.inspectionStandardId);
        } else {
          this.selectedStandard = undefined;
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
            inspectionStandardId: detail.inspectionStandardId,
            samplingSchemeId: detail.samplingSchemeId,
            remark: detail.remark
          });
          
          this.updateSamplingInfo();
        }

        if (this.isInspectMode) {
          this.inspectLoading = false;
        } else {
          this.loading = false;
        }
        this.cdr.markForCheck();
      },
      error: () => {
        if (this.isInspectMode) {
          this.inspectLoading = false;
        } else {
          this.loading = false;
        }
        this.messageService.error('加载检验单失败');
        this.cdr.markForCheck();
      }
    });
  }

  loadInspectionStandard(id: string): void {
    this.inspectionStandardService.get(id).subscribe({
      next: (standard) => {
        this.selectedStandard = standard;
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.error('加载检验标准失败');
        this.selectedStandard = undefined;
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

  getSamplingSchemeName(schemeId: string): string {
    const scheme = this.samplingSchemes.find(s => s.id === schemeId);
    return scheme ? scheme.name : '-';
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
      return;
    }

    const scheme = this.selectedSamplingScheme;
    
    if (scheme.schemeType === SamplingSchemeType.AQL && scheme.aqlConfigId) {
      this.relatedAqlConfigs = this.aqlConfigs.filter(config => config.id === scheme.aqlConfigId);
      this.matchedAqlConfig = this.findMatchingAqlConfig(scheme.aqlConfigId, lotSize);
      if (this.matchedAqlConfig) {
        this.sampleSize = this.matchedAqlConfig.sampleSize;
      } else {
        this.sampleSize = 0;
      }
    } else {
      this.relatedAqlConfigs = [];
      this.matchedAqlConfig = undefined;
      
      if (scheme.schemeType === SamplingSchemeType.CZero && scheme.fixedSampleSize) {
        this.sampleSize = scheme.fixedSampleSize;
      } else if (scheme.schemeType === SamplingSchemeType.Continuous && scheme.samplePercentage) {
        this.sampleSize = Math.ceil(lotSize * scheme.samplePercentage / 100);
      } else if (scheme.fixedSampleSize) {
        this.sampleSize = scheme.fixedSampleSize;
      } else if (scheme.samplePercentage) {
        this.sampleSize = Math.ceil(lotSize * scheme.samplePercentage / 100);
      } else {
        this.sampleSize = 0;
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

  openStandardSelector(): void {
    this.isStandardSelectorVisible = true;
  }

  onStandardSelected(standard: InspectionStandardDto): void {
    this.selectedStandard = standard;
    this.createForm.patchValue({
      inspectionStandardId: standard.id
    });
    this.cdr.markForCheck();
  }

  clearStandard(): void {
    this.selectedStandard = undefined;
    this.createForm.patchValue({
      inspectionStandardId: null
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

  saveRecord(record: any): void {
    if (!this.viewingOrder?.id) {
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

    this.iqcInspectionService.updateInspectionRecord(this.viewingOrder.id, record.id, updateInput).subscribe({
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

    if (this.isEdit && this.params.id) {
      return new Observable(subscriber => {
        this.iqcInspectionService.update(this.params.id!, this.createForm.value).subscribe({
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
        this.iqcInspectionService.create(this.createForm.value).subscribe({
          next: () => {
            this.messageService.success('创建成功');
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
