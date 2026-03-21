import { Component, OnInit, inject, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { IqcInspectionOrderDto, CreateUpdateIqcInspectionOrderDto, IqcInspectionRecordDto, CreateUpdateIqcInspectionRecordDto } from '../../models/iqc-inspection.model';
import { IqcInspectionService } from '../../services/iqc-inspection.service';
import { SamplingSchemeDto } from '../../models/sampling-scheme.model';
import { SamplingSchemeService } from '../../services/sampling-scheme.service';
import { AqlConfigDto } from '../../models/aql-config.model';
import { AqlConfigService } from '../../services/aql-config.service';
import { QualityInspectionPlanSelectorComponent } from '../quality-inspection-plan-selector/quality-inspection-plan-selector.component';
import { QualityInspectionPlanDto } from '../../models/quality-inspection-plan.model';
import { QualityInspectionPlanService } from '../../services/quality-inspection-plan.service';
import { MaterialSelectorComponent } from '../material-selector/material-selector.component';
import { SupplierSelectorComponent } from '../supplier-selector/supplier-selector.component';
import { MaterialDto } from '../../models/material.model';
import { SupplierDto } from '../../models/supplier.model';
import { InspectionStatus, InspectionResult, ItemJudgment } from '../../models/enums';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-iqc-inspection-detail',
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
    NzTooltipModule,
    QualityInspectionPlanSelectorComponent,
    MaterialSelectorComponent,
    SupplierSelectorComponent
  ],
  templateUrl: './iqc-inspection-detail.component.html',
  styleUrls: ['./iqc-inspection-detail.component.less']
})
export class IqcInspectionDetailComponent implements OnInit, OnChanges {
  private iqcInspectionService = inject(IqcInspectionService);
  private samplingSchemeService = inject(SamplingSchemeService);
  private aqlConfigService = inject(AqlConfigService);
  private qualityInspectionPlanService = inject(QualityInspectionPlanService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  @Input() visible = false;
  @Input() mode: 'view' | 'edit' | 'create' = 'create';
  @Input() inspectionId?: string;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();

  loading = false;
  viewingOrder?: IqcInspectionOrderDto;
  createForm!: FormGroup;
  isEdit = false;
  isViewMode = false;
  selectedPlan?: QualityInspectionPlanDto;
  selectedMaterial?: MaterialDto;
  selectedSupplier?: SupplierDto;
  selectedOrder?: IqcInspectionOrderDto;
  samplingSchemes: SamplingSchemeDto[] = [];
  isPlanSelectorVisible = false;
  isMaterialSelectorVisible = false;
  isSupplierSelectorVisible = false;
  isExecutionVisible = false;

  sampleColumns: number[] = [];
  inspectionTreeData: any[] = [];

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
    this.loadSamplingSchemes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue) {
      this.isViewMode = this.mode === 'view';
      this.isEdit = this.mode === 'edit';
      
      if (this.mode === 'view' || this.mode === 'edit') {
        if (this.inspectionId) {
          this.loadInspection(this.inspectionId);
        }
      } else {
        this.resetForm();
      }
    }
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
      aqlValue: [0.65],
      sampleSize: [null],
      sampleSizeCode: [''],
      acceptanceNumber: [null],
      rejectionNumber: [null],
      remark: ['']
    });

    this.createForm.get('lotSize')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.findBestMatchAqlConfig();
    });

    this.createForm.get('aqlValue')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.findBestMatchAqlConfig();
    });

    this.createForm.get('samplingSchemeId')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.findBestMatchAqlConfig();
    });
  }

  findBestMatchAqlConfig(): void {
    const lotSize = this.createForm.get('lotSize')?.value;
    const aqlValue = this.createForm.get('aqlValue')?.value;
    const samplingSchemeId = this.createForm.get('samplingSchemeId')?.value;

if (samplingSchemeId === null || samplingSchemeId === undefined || samplingSchemeId === '') {
  return;
}

    if (!lotSize || !aqlValue) {
      this.createForm.patchValue({
        sampleSize: null,
        sampleSizeCode: '',
        acceptanceNumber: null,
        rejectionNumber: null
      }, { emitEvent: false });
      return;
    }

    this.aqlConfigService.findBestMatch(samplingSchemeId, lotSize, aqlValue).subscribe({
      next: (config) => {
        if (config) {
          this.createForm.patchValue({
            sampleSize: config.sampleSize,
            sampleSizeCode: config.sampleSizeCode,
            acceptanceNumber: config.acceptanceNumber,
            rejectionNumber: config.rejectionNumber
          }, { emitEvent: false });
        } else {
          this.createForm.patchValue({
            sampleSize: null,
            sampleSizeCode: '',
            acceptanceNumber: null,
            rejectionNumber: null
          }, { emitEvent: false });
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.createForm.patchValue({
          sampleSize: null,
          sampleSizeCode: '',
          acceptanceNumber: null,
          rejectionNumber: null
        }, { emitEvent: false });
        this.cdr.markForCheck();
      }
    });
  }

  resetForm(): void {
    this.createForm.reset({
      aqlValue: 0.65
    });
    this.viewingOrder = undefined;
    this.selectedPlan = undefined;
    this.selectedMaterial = undefined;
    this.selectedSupplier = undefined;
    this.cdr.markForCheck();
  }

  loadInspection(id: string): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.iqcInspectionService.get(id).subscribe({
      next: (detail) => {
        this.viewingOrder = detail;
        this.buildInspectionTreeData();
        
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
        
        if (detail.qualityInspectionPlanId) {
          this.loadQualityInspectionPlan(detail.qualityInspectionPlanId);
        } else {
          this.selectedPlan = undefined;
        }

        if (this.mode === 'edit') {
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
            remark: detail.remark
          });
        }

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.messageService.error('加载检验单失败');
        this.cdr.markForCheck();
      }
    });
  }

  loadQualityInspectionPlan(id: string): void {
    this.qualityInspectionPlanService.get(id).subscribe({
      next: (plan) => {
        this.selectedPlan = plan;
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

  buildInspectionTreeData(): void {
    this.inspectionTreeData = [];
    this.sampleColumns = [];
    
    if (!this.viewingOrder?.records || this.viewingOrder.records.length === 0) {
      return;
    }

    const sampleSize = this.viewingOrder.sampleSize || 0;
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
          samples: record.samples || []
        }))
      };
      this.inspectionTreeData.push(stepNode);
    }
  }

  getSamplingSchemeName(schemeId: string): string {
    const scheme = this.samplingSchemes.find(s => s.id === schemeId);
    return scheme ? scheme.name : '-';
  }

  onSchemeChange(schemeId: string): void {
    if (!schemeId) {
      this.createForm.patchValue({
        aqlValue: null,
        sampleSize: null,
        sampleSizeCode: '',
        acceptanceNumber: null,
        rejectionNumber: null
      });
      return;
    }

    const scheme = this.samplingSchemes.find(s => s.id === schemeId);
    if (scheme) {
      if (scheme.aqlConfigId) {
        this.aqlConfigService.get(scheme.aqlConfigId).subscribe({
          next: (aqlConfig) => {
            this.createForm.patchValue({
              aqlValue: aqlConfig.aqlValue,
              sampleSize: aqlConfig.sampleSize,
              sampleSizeCode: aqlConfig.sampleSizeCode,
              acceptanceNumber: aqlConfig.acceptanceNumber,
              rejectionNumber: aqlConfig.rejectionNumber
            });
            this.cdr.markForCheck();
          },
          error: () => {
            this.createForm.patchValue({
              aqlValue: null,
              sampleSize: null,
              sampleSizeCode: '',
              acceptanceNumber: null,
              rejectionNumber: null
            });
          }
        });
      } else {
        this.createForm.patchValue({
          aqlValue: null,
          sampleSize: scheme.fixedSampleSize || null,
          sampleSizeCode: '',
          acceptanceNumber: scheme.acceptanceNumber,
          rejectionNumber: scheme.rejectionNumber
        });
      }
    }
    this.cdr.markForCheck();
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

  hasNG(samples: any[]): boolean {
    if (!samples || samples.length === 0) return false;
    return samples.some(s => s.judgment === ItemJudgment.NG);
  }

  allOK(samples: any[]): boolean {
    if (!samples || samples.length === 0) return false;
    return samples.length > 0 && samples.every(s => s.judgment === ItemJudgment.OK);
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

  handleCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  handleOk(): void {
    if (this.isViewMode) {
      this.handleCancel();
      return;
    }

    if (this.createForm.invalid) {
      Object.values(this.createForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const input: CreateUpdateIqcInspectionOrderDto = this.createForm.value;

    if (this.isEdit && this.inspectionId) {
      this.iqcInspectionService.update(this.inspectionId, input).subscribe({
        next: () => {
          this.messageService.success('更新成功');
          this.saved.emit();
          this.handleCancel();
        },
        error: (err) => {
          console.error('Update error:', err);
          this.messageService.error('更新失败');
        }
      });
    } else {
      this.iqcInspectionService.create(input).subscribe({
        next: () => {
          this.messageService.success('创建成功');
          this.saved.emit();
          this.handleCancel();
        },
        error: (err) => {
          console.error('Create error:', err);
          this.messageService.error('创建失败');
        }
      });
    }
  }

  openPlanSelector(): void {
    this.isPlanSelectorVisible = true;
  }

  onPlanSelected(plan: QualityInspectionPlanDto): void {
    this.selectedPlan = plan;
    this.createForm.patchValue({
      qualityInspectionPlanId: plan.id
    });
    this.cdr.markForCheck();
  }

  clearPlan(): void {
    this.selectedPlan = undefined;
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

  getRecordClass(record: any): string {
    if (!record.actualValue || record.judgment === ItemJudgment.Pending) {
      return '';
    }
    return record.judgment === ItemJudgment.OK ? 'record-pass' : 'record-fail';
  }

  getActualValueClass(record: any): string {
    if (!record.actualValue || record.judgment === ItemJudgment.Pending) {
      return '';
    }
    return record.judgment === ItemJudgment.OK ? 'actual-value-pass' : 'actual-value-fail';
  }

  autoJudge(record: any): void {
    if (!record.actualValue) {
      record.judgment = ItemJudgment.Pending;
      return;
    }

    const actualValue = parseFloat(record.actualValue);
    if (isNaN(actualValue)) {
      record.judgment = ItemJudgment.Pending;
      return;
    }

    let isPass = true;

    if (record.standardValue) {
      const standardValue = parseFloat(record.standardValue);
      if (!isNaN(standardValue)) {
        if (record.usl) {
          const usl = parseFloat(record.usl);
          if (!isNaN(usl) && actualValue > usl) {
            isPass = false;
          }
        }
        if (record.lsl) {
          const lsl = parseFloat(record.lsl);
          if (!isNaN(lsl) && actualValue < lsl) {
            isPass = false;
          }
        }
        if (record.ucl) {
          const ucl = parseFloat(record.ucl);
          if (!isNaN(ucl) && actualValue > ucl) {
            isPass = false;
          }
        }
        if (record.lcl) {
          const lcl = parseFloat(record.lcl);
          if (!isNaN(lcl) && actualValue < lcl) {
            isPass = false;
          }
        }
      }
    }

    record.judgment = isPass ? ItemJudgment.OK : ItemJudgment.NG;
  }
}
