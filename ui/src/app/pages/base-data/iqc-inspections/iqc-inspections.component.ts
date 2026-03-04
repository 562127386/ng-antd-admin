import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { IqcInspectionOrderDto, CreateUpdateIqcInspectionOrderDto, GetIqcInspectionOrderListDto } from '../models/iqc-inspection.model';
import { IqcInspectionService } from '../services/iqc-inspection.service';
import { SamplingSchemeDto } from '../models/sampling-scheme.model';
import { SamplingSchemeService } from '../services/sampling-scheme.service';
import { InspectionStandardSelectorComponent } from '../components/inspection-standard-selector/inspection-standard-selector.component';
import { InspectionStandardDto } from '../models/inspection-standard.model';
import { InspectionStandardService } from '../services/inspection-standard.service';
import { MaterialSelectorComponent } from '../components/material-selector/material-selector.component';
import { SupplierSelectorComponent } from '../components/supplier-selector/supplier-selector.component';
import { MaterialDto } from '../models/material.model';
import { SupplierDto } from '../models/supplier.model';
import { NonConformingService } from '../services/non-conforming.service';

@Component({
  selector: 'app-iqc-inspections',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzInputNumberModule,
    NzDividerModule,
    InspectionStandardSelectorComponent,
    MaterialSelectorComponent,
    SupplierSelectorComponent
  ],
  templateUrl: './iqc-inspections.component.html',
  styleUrls: ['./iqc-inspections.component.less']
})
export class IqcInspectionsComponent implements OnInit {
  private iqcInspectionService = inject(IqcInspectionService);
  private samplingSchemeService = inject(SamplingSchemeService);
  private inspectionStandardService = inject(InspectionStandardService);
  private nonConformingService = inject(NonConformingService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  data: IqcInspectionOrderDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  createForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  editId?: string;
  isViewMode = false;
  isStandardSelectorVisible = false;
  isMaterialSelectorVisible = false;
  isSupplierSelectorVisible = false;
  isExecutionVisible = false;
  selectedStandard?: InspectionStandardDto;
  selectedMaterial?: MaterialDto;
  selectedSupplier?: SupplierDto;
  selectedOrder?: IqcInspectionOrderDto;
  viewingOrder?: IqcInspectionOrderDto;
  samplingSchemes: SamplingSchemeDto[] = [];

  statusOptions = [
    { label: '草稿', value: 0, color: 'default' },
    { label: '待检验', value: 1, color: 'processing' },
    { label: '检验中', value: 2, color: 'warning' },
    { label: '已完成', value: 3, color: 'success' },
    { label: '已取消', value: 4, color: 'error' }
  ];

  resultOptions = [
    { label: '待判定', value: 0, color: 'default' },
    { label: '合格', value: 1, color: 'success' },
    { label: '不合格', value: 2, color: 'error' },
    { label: '特采', value: 3, color: 'warning' }
  ];

  ngOnInit(): void {
    this.initForms();
    this.loadData();
    this.loadSamplingSchemes();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      status: [null],
      result: [null]
    });

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

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetIqcInspectionOrderListDto = {
      filter: this.filterForm.value.filter,
      status: this.filterForm.value.status,
      result: this.filterForm.value.result,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.iqcInspectionService.getList(input).subscribe({
      next: (result) => {
        this.data = result.items;
        this.total = result.totalCount;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.messageService.error('加载数据失败');
      }
    });
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset(): void {
    this.filterForm.reset();
    this.pageIndex = 1;
    this.loadData();
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadData();
  }

  showAddModal(): void {
    this.isEdit = false;
    this.isViewMode = false;
    this.editId = undefined;
    this.selectedStandard = undefined;
    this.selectedMaterial = undefined;
    this.selectedSupplier = undefined;
    this.createForm.reset();
    this.isModalVisible = true;
  }

  showViewModal(item: IqcInspectionOrderDto): void {
    this.isEdit = false;
    this.isViewMode = true;
    this.editId = item.id;
    this.viewingOrder = item;
    
    if (item.materialId && item.materialCode && item.materialName) {
      this.selectedMaterial = {
        id: item.materialId,
        code: item.materialCode,
        name: item.materialName,
        materialType: 1,
        batchManagement: false,
        expiryManagement: false,
        isEnabled: true,
        creationTime: new Date()
      } as MaterialDto;
    } else {
      this.selectedMaterial = undefined;
    }
    
    if (item.supplierId && item.supplierName) {
      this.selectedSupplier = {
        id: item.supplierId,
        code: '',
        name: item.supplierName,
        isEnabled: true,
        sortOrder: 0,
        creationTime: new Date()
      } as SupplierDto;
    } else {
      this.selectedSupplier = undefined;
    }
    
    this.createForm.patchValue({
      orderNo: item.orderNo,
      materialId: item.materialId,
      materialCode: item.materialCode,
      materialName: item.materialName,
      batchNo: item.batchNo,
      lotSize: item.lotSize,
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      purchaseOrderNo: item.purchaseOrderNo,
      arrivalDate: item.arrivalDate,
      inspectionStandardId: item.inspectionStandardId,
      samplingSchemeId: item.samplingSchemeId,
      remark: item.remark
    });
    
    if (item.inspectionStandardId) {
      this.loadInspectionStandard(item.inspectionStandardId);
    } else {
      this.selectedStandard = undefined;
    }
    
    this.isModalVisible = true;
  }

  getJudgmentText(judgment?: number): string {
    if (judgment === undefined || judgment === null) return '待判定';
    switch (judgment) {
      case 0: return '待判定';
      case 1: return '合格';
      case 2: return '不合格';
      default: return '待判定';
    }
  }

  getJudgmentColor(judgment?: number): string {
    if (judgment === undefined || judgment === null) return 'default';
    switch (judgment) {
      case 1: return 'success';
      case 2: return 'error';
      default: return 'default';
    }
  }

  showEditModal(item: IqcInspectionOrderDto): void {
    if (item.status !== 0 && item.status !== 1) {
      this.messageService.warning('只有草稿或待检验状态的单据可以编辑');
      return;
    }
    this.isEdit = true;
    this.isViewMode = false;
    this.editId = item.id;
    
    if (item.materialId && item.materialCode && item.materialName) {
      this.selectedMaterial = {
        id: item.materialId,
        code: item.materialCode,
        name: item.materialName,
        materialType: 1,
        batchManagement: false,
        expiryManagement: false,
        isEnabled: true,
        creationTime: new Date()
      } as MaterialDto;
    } else {
      this.selectedMaterial = undefined;
    }
    
    if (item.supplierId && item.supplierName) {
      this.selectedSupplier = {
        id: item.supplierId,
        code: '',
        name: item.supplierName,
        isEnabled: true,
        sortOrder: 0,
        creationTime: new Date()
      } as SupplierDto;
    } else {
      this.selectedSupplier = undefined;
    }
    
    this.createForm.patchValue({
      orderNo: item.orderNo,
      materialId: item.materialId,
      materialCode: item.materialCode,
      materialName: item.materialName,
      batchNo: item.batchNo,
      lotSize: item.lotSize,
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      purchaseOrderNo: item.purchaseOrderNo,
      arrivalDate: item.arrivalDate,
      inspectionStandardId: item.inspectionStandardId,
      samplingSchemeId: item.samplingSchemeId,
      remark: item.remark
    });
    
    if (item.inspectionStandardId) {
      this.loadInspectionStandard(item.inspectionStandardId);
    } else {
      this.selectedStandard = undefined;
    }
    
    this.isModalVisible = true;
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

  handleCancel(): void {
    this.isModalVisible = false;
    this.viewingOrder = undefined;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    if (this.isViewMode) {
      this.isModalVisible = false;
      this.viewingOrder = undefined;
      this.cdr.markForCheck();
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

    if (this.isEdit && this.editId) {
      this.iqcInspectionService.update(this.editId, input).subscribe({
        next: () => {
          this.messageService.success('更新成功');
          this.isModalVisible = false;
          this.cdr.markForCheck();
          this.loadData();
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
          this.isModalVisible = false;
          this.cdr.markForCheck();
          this.loadData();
        },
        error: (err) => {
          console.error('Create error:', err);
          this.messageService.error('创建失败');
        }
      });
    }
  }

  startInspection(id: string): void {
    this.iqcInspectionService.startInspection(id).subscribe({
      next: () => {
        this.messageService.success('开始检验成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('开始检验失败');
      }
    });
  }

  completeInspection(id: string): void {
    this.iqcInspectionService.completeInspection(id, 1).subscribe({
      next: () => {
        this.messageService.success('完成检验成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('完成检验失败');
      }
    });
  }

  cancelInspection(id: string): void {
    this.iqcInspectionService.cancel(id).subscribe({
      next: () => {
        this.messageService.success('取消成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('取消失败');
      }
    });
  }

  showDeleteConfirm(id: string): void {
    this.iqcInspectionService.delete(id).subscribe({
      next: () => {
        this.messageService.success('删除成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('删除失败');
      }
    });
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

  canEdit(status: number): boolean {
    return status === 0 || status === 1;
  }

  canDelete(status: number): boolean {
    return status === 0;
  }

  canStartInspection(status: number): boolean {
    return status === 1;
  }

  canCompleteInspection(status: number): boolean {
    return status === 2;
  }

  canCancel(status: number): boolean {
    return status !== 4;
  }

  canExecuteInspection(status: number): boolean {
    return status === 2;
  }

  canSubmit(status: number): boolean {
    return status === 0;
  }

  submitInspection(id: string): void {
    this.iqcInspectionService.submit(id).subscribe({
      next: () => {
        this.messageService.success('提交成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('提交失败');
      }
    });
  }

  openExecutionModal(item: IqcInspectionOrderDto): void {
    this.selectedOrder = item;
    this.isExecutionVisible = true;
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

  autoJudge(record: any): void {
    if (!record.actualValue) {
      record.judgment = 0;
      return;
    }

    const actualValue = parseFloat(record.actualValue);
    if (isNaN(actualValue)) {
      record.judgment = 0;
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

    record.judgment = isPass ? 1 : 2;
  }

  getRecordClass(record: any): string {
    if (!record.actualValue || record.judgment === 0) {
      return '';
    }
    return record.judgment === 1 ? 'record-pass' : 'record-fail';
  }

  getActualValueClass(record: any): string {
    if (!record.actualValue || record.judgment === 0) {
      return '';
    }
    return record.judgment === 1 ? 'actual-value-pass' : 'actual-value-fail';
  }

  saveRecord(record: any): void {
    if (!this.selectedOrder) return;
    
    const input = {
      id: record.id,
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
      improvementDescription: record.improvementDescription,
      defectCount: record.defectCount || 0,
      remark: record.remark
    };

    this.iqcInspectionService.updateInspectionRecord(this.selectedOrder.id, record.id, input).subscribe({
      next: () => {
        this.messageService.success('保存检验记录成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('保存检验记录失败');
      }
    });
  }

  completeFromExecution(id: string): void {
    this.iqcInspectionService.completeInspection(id, 1).subscribe({
      next: () => {
        this.messageService.success('完成检验成功');
        this.isExecutionVisible = false;
        this.loadData();
      },
      error: () => {
        this.messageService.error('完成检验失败');
      }
    });
  }

  createNonConforming(item: IqcInspectionOrderDto): void {
    this.nonConformingService.createFromIqcInspection(item.id).subscribe({
      next: (result) => {
        this.messageService.success('创建不合格品处理单成功，单号：' + result.orderNo);
      },
      error: () => {
        this.messageService.error('创建不合格品处理单失败');
      }
    });
  }

  canCreateNonConforming(status: number, result?: number): boolean {
    return status === 3 && result === 2;
  }
}
