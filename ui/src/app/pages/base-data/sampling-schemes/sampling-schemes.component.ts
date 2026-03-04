import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { SamplingSchemeDto, CreateUpdateSamplingSchemeDto, GetSamplingSchemeListDto } from '../models/sampling-scheme.model';
import { SamplingSchemeService } from '../services/sampling-scheme.service';
import { AqlConfigDto } from '../models/aql-config.model';
import { AqlConfigService } from '../services/aql-config.service';

@Component({
  selector: 'app-sampling-schemes',
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
    NzSwitchModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzInputNumberModule,
    NzDividerModule
  ],
  templateUrl: './sampling-schemes.component.html',
  styleUrls: ['./sampling-schemes.component.less']
})
export class SamplingSchemesComponent implements OnInit {
  private samplingSchemeService = inject(SamplingSchemeService);
  private aqlConfigService = inject(AqlConfigService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  data: SamplingSchemeDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  editId?: string;
  aqlConfigOptions: AqlConfigDto[] = [];

  schemeTypeOptions = [
    { label: 'AQL抽样', value: 1 },
    { label: 'C=0抽样', value: 2 },
    { label: '计量抽样', value: 3 },
    { label: '连续抽样', value: 4 },
    { label: '跳批抽样', value: 5 }
  ];

  inspectionLevelOptions = [
    { label: 'S-1', value: 1 },
    { label: 'S-2', value: 2 },
    { label: 'S-3', value: 3 },
    { label: 'S-4', value: 4 },
    { label: 'I', value: 5 },
    { label: 'II', value: 6 },
    { label: 'III', value: 7 }
  ];

  ngOnInit(): void {
    this.initForms();
    this.loadData();
    this.loadAqlConfigs();
  }

  loadAqlConfigs(): void {
    this.aqlConfigService.getList({ isEnabled: true, maxResultCount: 1000 }).subscribe({
      next: (result) => {
        this.aqlConfigOptions = result.items;
        this.cdr.markForCheck();
      },
      error: () => {
        this.messageService.error('加载AQL配置失败');
      }
    });
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      isEnabled: [null],
      schemeType: [null]
    });

    this.searchForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      schemeType: [null, [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      isEnabled: [true],
      sortOrder: [0, [Validators.min(0)]],
      aqlConfigId: [null],
      fixedSampleSize: [null, [Validators.min(0)]],
      samplePercentage: [null, [Validators.min(0), Validators.max(100)]],
      acceptanceNumber: [null, [Validators.min(0)]],
      rejectionNumber: [null, [Validators.min(0)]]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetSamplingSchemeListDto = {
      filter: this.filterForm.value.filter,
      isEnabled: this.filterForm.value.isEnabled,
      schemeType: this.filterForm.value.schemeType,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.samplingSchemeService.getList(input).subscribe({
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
    this.searchForm.patchValue({ isEnabled: true, sortOrder: 0 });
    this.isModalVisible = true;
  }

  showEditModal(item: SamplingSchemeDto): void {
    this.isEdit = true;
    this.editId = item.id;
    this.searchForm.patchValue({
      code: item.code,
      name: item.name,
      schemeType: item.schemeType,
      description: item.description,
      isEnabled: item.isEnabled,
      sortOrder: item.sortOrder,
      aqlConfigId: item.aqlConfigId,
      fixedSampleSize: item.fixedSampleSize,
      samplePercentage: item.samplePercentage,
      acceptanceNumber: item.acceptanceNumber,
      rejectionNumber: item.rejectionNumber
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    Object.values(this.searchForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (this.searchForm.invalid) {
      this.messageService.warning('请检查表单填写是否正确');
      return;
    }

    if (!this.validateSchemeTypeFields()) {
      const c0Message = this.getC0ValidationMessage();
      if (c0Message) {
        this.messageService.warning(c0Message);
      } else {
        this.messageService.warning('请完善抽样方案必填字段');
      }
      return;
    }

    const input: CreateUpdateSamplingSchemeDto = this.searchForm.value;

    if (this.isEdit && this.editId) {
      this.samplingSchemeService.update(this.editId, input).subscribe({
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
      this.samplingSchemeService.create(input).subscribe({
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

  showDeleteConfirm(id: string): void {
    this.samplingSchemeService.delete(id).subscribe({
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

  toggleEnabled(item: SamplingSchemeDto): void {
    this.samplingSchemeService.setEnabled(item.id, !item.isEnabled).subscribe({
      next: () => {
        this.messageService.success('状态更新成功');
        this.cdr.markForCheck();
        this.loadData();
      },
      error: () => {
        this.messageService.error('状态更新失败');
        this.cdr.markForCheck();
      }
    });
  }

  getSchemeTypeText(type: number): string {
    const option = this.schemeTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }

  getInspectionLevelText(level: number): string {
    const option = this.inspectionLevelOptions.find(o => o.value === level);
    return option ? option.label : '';
  }

  getFieldValidationClass(fieldName: string): string {
    const control = this.searchForm.get(fieldName);
    if (!control) return '';
    
    if (!control.touched && !control.dirty) return '';
    return control.invalid ? 'field-error' : 'field-success';
  }

  getFieldValidationMessage(fieldName: string): string {
    const control = this.searchForm.get(fieldName);
    if (!control || !control.touched || !control.dirty || control.valid) return '';

    if (control.errors?.['required']) {
      return '此字段为必填项';
    }
    if (control.errors?.['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `长度不能超过${maxLength}个字符`;
    }
    if (control.errors?.['min']) {
      const min = control.errors['min'].min;
      return `值不能小于${min}`;
    }
    if (control.errors?.['max']) {
      const max = control.errors['max'].max;
      return `值不能大于${max}`;
    }
    if (control.errors?.['pattern']) {
      return '格式不正确，只能包含字母、数字、下划线和连字符';
    }
    return '输入值不正确';
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.searchForm.get(fieldName);
    if (!control) return true;
    
    if (!control.touched && !control.dirty) return true;
    return control.valid;
  }

  validateSchemeTypeFields(): boolean {
    const schemeType = this.searchForm.get('schemeType')?.value;
    
    if (schemeType === 1) {
      const aqlConfigId = this.searchForm.get('aqlConfigId')?.value;
      return aqlConfigId !== null;
    } else if (schemeType === 2) {
      const fixedSampleSize = this.searchForm.get('fixedSampleSize')?.value;
      const acceptanceNumber = this.searchForm.get('acceptanceNumber')?.value;
      const rejectionNumber = this.searchForm.get('rejectionNumber')?.value;
      
      if (fixedSampleSize === null || fixedSampleSize === undefined) return false;
      if (acceptanceNumber === null || acceptanceNumber === undefined) return false;
      if (rejectionNumber === null || rejectionNumber === undefined) return false;
      
      if (rejectionNumber <= acceptanceNumber) {
        return false;
      }
      return true;
    } else if (schemeType === 4) {
      const samplePercentage = this.searchForm.get('samplePercentage')?.value;
      return samplePercentage !== null && samplePercentage !== undefined;
    }
    
    return true;
  }

  getC0ValidationMessage(): string {
    const schemeType = this.searchForm.get('schemeType')?.value;
    if (schemeType !== 2) return '';
    
    const acceptanceNumber = this.searchForm.get('acceptanceNumber')?.value;
    const rejectionNumber = this.searchForm.get('rejectionNumber')?.value;
    
    if (acceptanceNumber !== null && acceptanceNumber !== undefined && 
        rejectionNumber !== null && rejectionNumber !== undefined) {
      if (rejectionNumber <= acceptanceNumber) {
        return '拒收数(Re)必须大于接收数(Ac)';
      }
    }
    return '';
  }
}
