import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { 
  InspectionStandardDto, 
  CreateUpdateInspectionStandardDto, 
  GetInspectionStandardListDto,
  CreateUpdateInspectionItemDto,
  InspectionStandardStatus
} from '../models/inspection-standard.model';
import { InspectionStandardService } from '../services/inspection-standard.service';
import { GeneralInspectionItemService } from '../services/general-inspection-item.service';
import { GeneralInspectionItemDto } from '../models/general-inspection-item.model';
import { SamplingSchemeConfigComponent } from '../components/sampling-scheme-config/sampling-scheme-config.component';

@Component({
  selector: 'app-inspection-standards',
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
    NzSwitchModule,
    NzTagModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzInputNumberModule,
    NzDividerModule,
    SamplingSchemeConfigComponent
  ],
  templateUrl: './inspection-standards.component.html',
  styleUrls: ['./inspection-standards.component.less']
})
export class InspectionStandardsComponent implements OnInit {
  private inspectionStandardService = inject(InspectionStandardService);
  private generalInspectionItemService = inject(GeneralInspectionItemService);
  private fb = inject(FormBuilder);
  private modalService = inject(NzModalService);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  generalInspectionItems: GeneralInspectionItemDto[] = [];
  isGeneralItemsLoading = false;

  loading = false;
  data: InspectionStandardDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  editId?: string;

  inspectionTypeOptions = [
    { label: 'IQC', value: 1 },
    { label: 'IPQC', value: 2 },
    { label: 'FQC', value: 3 },
    { label: 'OQC', value: 4 }
  ];

  samplingSchemeTypeOptions = [
    { label: 'AQL', value: 1 },
    { label: 'C=0', value: 2 },
    { label: '计量型', value: 3 },
    { label: '连续生产', value: 4 },
    { label: '跳批', value: 5 }
  ];

  inspectionMethodOptions = [
    { label: '计量', value: 1 },
    { label: '计数', value: 2 }
  ];

  statusOptions = [
    { label: '草稿', value: 1 },
    { label: '生效中', value: 2 },
    { label: '已失效', value: 3 }
  ];

  get itemsFormArray(): FormArray {
    return this.searchForm.get('items') as FormArray;
  }

  validateItemValues(itemGroup: any): void {
    const group = itemGroup as FormGroup;
    const standardValue = group.get('standardValue')?.value;
    const usl = group.get('usl')?.value;
    const lsl = group.get('lsl')?.value;
    const ucl = group.get('ucl')?.value;
    const lcl = group.get('lcl')?.value;

    const standardValueControl = group.get('standardValue');
    const uslControl = group.get('usl');
    const lslControl = group.get('lsl');
    const uclControl = group.get('ucl');
    const lclControl = group.get('lcl');

    standardValueControl?.setErrors(null);
    uslControl?.setErrors(null);
    lslControl?.setErrors(null);
    uclControl?.setErrors(null);
    lclControl?.setErrors(null);

    if (standardValue !== null && standardValue !== undefined) {
      if (usl !== null && usl !== undefined && standardValue > usl) {
        standardValueControl?.setErrors({ greaterThanUSL: true });
      }
      if (lsl !== null && lsl !== undefined && standardValue < lsl) {
        standardValueControl?.setErrors({ lessThanLSL: true });
      }
      if (ucl !== null && ucl !== undefined && standardValue > ucl) {
        standardValueControl?.setErrors({ greaterThanUCL: true });
      }
      if (lcl !== null && lcl !== undefined && standardValue < lcl) {
        standardValueControl?.setErrors({ lessThanLCL: true });
      }
    }

    if (usl !== null && usl !== undefined && lsl !== null && lsl !== undefined && usl < lsl) {
      uslControl?.setErrors({ uslLessThanLSL: true });
      lslControl?.setErrors({ lslGreaterThanUSL: true });
    }

    if (ucl !== null && ucl !== undefined && lcl !== null && lcl !== undefined && ucl < lcl) {
      uclControl?.setErrors({ uclLessThanLCL: true });
      lclControl?.setErrors({ lclGreaterThanUCL: true });
    }

    if (usl !== null && usl !== undefined && ucl !== null && ucl !== undefined && ucl > usl) {
      uclControl?.setErrors({ uclGreaterThanUSL: true });
    }

    if (lsl !== null && lsl !== undefined && lcl !== null && lcl !== undefined && lcl < lsl) {
      lclControl?.setErrors({ lclLessThanLSL: true });
    }
  }

  getItemValidationClass(controlName: string, itemGroup: any): string {
    const group = itemGroup as FormGroup;
    const control = group.get(controlName);
    if (!control || !control.errors || !control.dirty) {
      return '';
    }
    return 'validation-error';
  }

  getItemValidationMessage(controlName: string, itemGroup: any): string {
    const group = itemGroup as FormGroup;
    const control = group.get(controlName);
    if (!control || !control.errors || !control.dirty) {
      return '';
    }

    const errors = control.errors;
    if (errors['greaterThanUSL']) return '标准值不能大于规格上限';
    if (errors['lessThanLSL']) return '标准值不能小于规格下限';
    if (errors['greaterThanUCL']) return '标准值不能大于控制上限';
    if (errors['lessThanLCL']) return '标准值不能小于控制下限';
    if (errors['uslLessThanLSL']) return '规格上限不能小于规格下限';
    if (errors['lslGreaterThanUSL']) return '规格下限不能大于规格上限';
    if (errors['uclLessThanLCL']) return '控制上限不能小于控制下限';
    if (errors['lclGreaterThanUCL']) return '控制下限不能大于控制上限';
    if (errors['uclGreaterThanUSL']) return '控制上限不能大于规格上限';
    if (errors['lclLessThanLSL']) return '控制下限不能小于规格下限';

    return '';
  }

  isItemValid(itemGroup: any): boolean {
    const group = itemGroup as FormGroup;
    return !group.invalid;
  }

  ngOnInit(): void {
    this.initForms();
    this.loadData();
    this.loadGeneralInspectionItems();
  }

  loadGeneralInspectionItems(): void {
    this.isGeneralItemsLoading = true;
    this.generalInspectionItemService.getAllItems().subscribe({
      next: (items: GeneralInspectionItemDto[]) => {
        this.generalInspectionItems = items;
        this.isGeneralItemsLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isGeneralItemsLoading = false;
        this.messageService.error('加载通用检查项目失败');
        this.cdr.markForCheck();
      }
    });
  }

  showGeneralItemsModal(): void {
    this.modalService.create({
      nzTitle: '选择通用检查项目',
      nzWidth: 800,
      nzContent: `
        <nz-table
          #generalItemsTable
          [nzData]="generalInspectionItems"
          [nzLoading]="isGeneralItemsLoading"
          nzShowPagination="true"
          [nzPageSize]="10"
        >
          <thead>
            <tr>
              <th>检查内容</th>
              <th>检查项目</th>
              <th>不良项目</th>
              <th>不良状态</th>
              <th>不良判定</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of generalItemsTable.data">
              <td>{{ item.inspectionContent }}</td>
              <td>{{ item.inspectionItemName }}</td>
              <td>{{ item.defectItem }}</td>
              <td>{{ item.defectStatus }}</td>
              <td>
                <nz-space>
                  <nz-tag *ngIf="item.isCritical" nzColor="error">CR</nz-tag>
                  <nz-tag *ngIf="item.isMajor" nzColor="warning">MAJ</nz-tag>
                  <nz-tag *ngIf="item.isMinor" nzColor="success">MIN</nz-tag>
                </nz-space>
              </td>
              <td>
                <button nz-button nzSize="small" (click)="addFromGeneralItem(item)">添加</button>
              </td>
            </tr>
          </tbody>
        </nz-table>
      `,
      nzFooter: [
        { 
          label: '关闭', 
          onClick: (modalInstance: any) => modalInstance.destroy() 
        }
      ]
    });
  }

  addFromGeneralItem(item: GeneralInspectionItemDto): void {
    const itemGroup = this.createItemFormGroup();
    itemGroup.patchValue({
      code: item.inspectionItemName.replace(/\s+/g, '_').toUpperCase(),
      name: item.inspectionItemName,
      inspectionMethod: 2, // 计数
      isCritical: item.isCritical,
      sortOrder: this.itemsFormArray.length
    });
    this.itemsFormArray.push(itemGroup);
    this.modalService.closeAll();
    this.messageService.success('已添加通用检查项目');
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      status: [null]
    });

    this.searchForm = this.fb.group({
      code: ['', [Validators.required]],
      version: ['', [Validators.required]],
      effectiveDate: [null, [Validators.required]],
      expiryDate: [null],
      inspectionType: [null, [Validators.required]],
      samplingSchemeType: [null, [Validators.required]],
      samplingSchemeConfig: [''],
      items: this.fb.array([])
    });
  }

  createItemFormGroup(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      inspectionMethod: [null, [Validators.required]],
      standardValue: [null],
      usl: [null],
      ucl: [null],
      lcl: [null],
      lsl: [null],
      tool: [''],
      methodDescription: [''],
      frequency: [''],
      isCritical: [false],
      defectSeverity: [null],
      defectCode: [''],
      sortOrder: [0, [Validators.required]]
    });
  }

  addItem(): void {
    this.itemsFormArray.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetInspectionStandardListDto = {
      filter: this.filterForm.value.filter,
      status: this.filterForm.value.status,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.inspectionStandardService.getList(input).subscribe({
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
    this.editId = undefined;
    this.searchForm.reset();
    this.itemsFormArray.clear();
    this.isModalVisible = true;
  }

  showEditModal(item: InspectionStandardDto): void {
    this.isEdit = true;
    this.editId = item.id;
    
    this.itemsFormArray.clear();
    if (item.items) {
      item.items.forEach(i => {
        const itemGroup = this.createItemFormGroup();
        itemGroup.patchValue(i);
        this.itemsFormArray.push(itemGroup);
      });
    }

    this.searchForm.patchValue({
      code: item.code,
      version: item.version,
      effectiveDate: item.effectiveDate,
      expiryDate: item.expiryDate,
      inspectionType: item.inspectionType,
      samplingSchemeType: item.samplingSchemeType,
      samplingSchemeConfig: item.samplingSchemeConfig
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    let hasInvalidItems = false;
    this.itemsFormArray.controls.forEach(itemGroup => {
      this.validateItemValues(itemGroup as FormGroup);
      if ((itemGroup as FormGroup).invalid) {
        hasInvalidItems = true;
      }
    });

    if (this.searchForm.invalid || hasInvalidItems) {
      Object.values(this.searchForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      
      if (hasInvalidItems) {
        this.messageService.warning('存在检验项目校验不通过，请检查');
      }
      return;
    }

    const input: CreateUpdateInspectionStandardDto = this.searchForm.value;

    if (this.isEdit && this.editId) {
      this.inspectionStandardService.update(this.editId, input).subscribe({
        next: () => {
          this.messageService.success('更新成功');
          this.isModalVisible = false;
          this.cdr.markForCheck();
          this.loadData();
        },
        error: () => {
          this.messageService.error('更新失败');
        }
      });
    } else {
      this.inspectionStandardService.create(input).subscribe({
        next: () => {
          this.messageService.success('创建成功');
          this.isModalVisible = false;
          this.cdr.markForCheck();
          this.loadData();
        },
        error: () => {
          this.messageService.error('创建失败');
        }
      });
    }
  }

  showDeleteConfirm(id: string): void {
    this.modalService.confirm({
      nzTitle: '确认删除',
      nzContent: '确定要删除这条记录吗？',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(id),
      nzCancelText: '取消'
    });
  }

  delete(id: string): void {
    this.inspectionStandardService.delete(id).subscribe({
      next: () => {
        this.messageService.success('删除成功');
        this.cdr.markForCheck();
        this.loadData();
      },
      error: () => {
        this.messageService.error('删除失败');
        this.cdr.markForCheck();
      }
    });
  }

  publish(id: string): void {
    this.inspectionStandardService.publish(id).subscribe({
      next: () => {
        this.messageService.success('发布成功');
        this.cdr.markForCheck();
        this.loadData();
      },
      error: () => {
        this.messageService.error('发布失败');
        this.cdr.markForCheck();
      }
    });
  }

  getInspectionTypeText(type: number): string {
    const option = this.inspectionTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }

  getStatusText(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : '';
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'orange';
      case 2:
        return 'green';
      case 3:
        return 'red';
      default:
        return 'default';
    }
  }
}
