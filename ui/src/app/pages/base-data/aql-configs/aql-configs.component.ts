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
import { AqlConfigDto, CreateUpdateAqlConfigDto, GetAqlConfigListDto } from '../models/aql-config.model';
import { AqlConfigService } from '../services/aql-config.service';

@Component({
  selector: 'app-aql-configs',
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
    NzInputNumberModule
  ],
  templateUrl: './aql-configs.component.html',
  styleUrls: ['./aql-configs.component.less']
})
export class AqlConfigsComponent implements OnInit {
  private aqlConfigService = inject(AqlConfigService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  data: AqlConfigDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  editId?: string;

  inspectionLevelOptions = [
    { label: 'S-1', value: 1 },
    { label: 'S-2', value: 2 },
    { label: 'S-3', value: 3 },
    { label: 'S-4', value: 4 },
    { label: 'I', value: 5 },
    { label: 'II', value: 6 },
    { label: 'III', value: 7 }
  ];

  aqlValueOptions = [
    { label: '0.01', value: 0.01 },
    { label: '0.02', value: 0.02 },
    { label: '0.04', value: 0.04 },
    { label: '0.065', value: 0.065 },
    { label: '0.1', value: 0.1 },
    { label: '0.15', value: 0.15 },
    { label: '0.25', value: 0.25 },
    { label: '0.4', value: 0.4 },
    { label: '0.65', value: 0.65 },
    { label: '1.0', value: 1.0 },
    { label: '1.5', value: 1.5 },
    { label: '2.5', value: 2.5 },
    { label: '4.0', value: 4.0 },
    { label: '6.5', value: 6.5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '25', value: 25 },
    { label: '40', value: 40 }
  ];

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      aqlValue: [null],
      inspectionLevel: [null],
      isEnabled: [null]
    });

    this.searchForm = this.fb.group({
      code: ['', [Validators.required]],
      aqlValue: [null, [Validators.required]],
      inspectionLevel: [null, [Validators.required]],
      minLotSize: [null, [Validators.required]],
      maxLotSize: [null, [Validators.required]],
      sampleSizeCode: ['', [Validators.required]],
      sampleSize: [null, [Validators.required]],
      acceptanceNumber: [null, [Validators.required]],
      rejectionNumber: [null, [Validators.required]],
      remark: [''],
      isEnabled: [true]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetAqlConfigListDto = {
      filter: this.filterForm.value.filter,
      aqlValue: this.filterForm.value.aqlValue,
      inspectionLevel: this.filterForm.value.inspectionLevel,
      isEnabled: this.filterForm.value.isEnabled,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.aqlConfigService.getList(input).subscribe({
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
    this.searchForm.patchValue({ isEnabled: true });
    this.isModalVisible = true;
  }

  showEditModal(item: AqlConfigDto): void {
    this.isEdit = true;
    this.editId = item.id;
    this.searchForm.patchValue({
      code: item.code,
      aqlValue: item.aqlValue,
      inspectionLevel: item.inspectionLevel,
      minLotSize: item.minLotSize,
      maxLotSize: item.maxLotSize,
      sampleSizeCode: item.sampleSizeCode,
      sampleSize: item.sampleSize,
      acceptanceNumber: item.acceptanceNumber,
      rejectionNumber: item.rejectionNumber,
      remark: item.remark,
      isEnabled: item.isEnabled
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    if (this.searchForm.invalid) {
      Object.values(this.searchForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const input: CreateUpdateAqlConfigDto = this.searchForm.value;

    if (this.isEdit && this.editId) {
      this.aqlConfigService.update(this.editId, input).subscribe({
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
      this.aqlConfigService.create(input).subscribe({
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
    this.aqlConfigService.delete(id).subscribe({
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

  toggleEnabled(item: AqlConfigDto): void {
    this.aqlConfigService.setEnabled(item.id, !item.isEnabled).subscribe({
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

  getInspectionLevelText(level: number): string {
    const option = this.inspectionLevelOptions.find(o => o.value === level);
    return option ? option.label : '';
  }
}
