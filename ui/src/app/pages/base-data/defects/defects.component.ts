import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DefectDto, CreateUpdateDefectDto, GetDefectListDto } from '../models/defect.model';
import { DefectService } from '../services/defect.service';

@Component({
  selector: 'app-defects',
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
    NzTagModule,
    NzIconModule
  ],
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.less']
})
export class DefectsComponent implements OnInit {
  private defectService = inject(DefectService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  data: DefectDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  editId?: string;

  categoryOptions = [
    { label: '外观', value: 1 },
    { label: '尺寸', value: 2 },
    { label: '性能', value: 3 },
    { label: '包装', value: 4 }
  ];

  severityOptions = [
    { label: '轻微', value: 1 },
    { label: '一般', value: 2 },
    { label: '严重', value: 3 },
    { label: '致命', value: 4 }
  ];

  moduleOptions = [
    { label: 'IQC', value: 1 },
    { label: 'IPQC', value: 2 },
    { label: 'FQC', value: 3 },
    { label: 'OQC', value: 4 }
  ];

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      category: [null],
      severity: [null],
      module: [null],
      isEnabled: [null]
    });

    this.searchForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      category: [null, [Validators.required]],
      severity: [null, [Validators.required]],
      module: [null, [Validators.required]],
      remark: [''],
      isEnabled: [true]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetDefectListDto = {
      filter: this.filterForm.value.filter,
      category: this.filterForm.value.category,
      severity: this.filterForm.value.severity,
      module: this.filterForm.value.module,
      isEnabled: this.filterForm.value.isEnabled,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.defectService.getList(input).subscribe({
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
    this.isModalVisible = true;
  }

  showEditModal(item: DefectDto): void {
    this.isEdit = true;
    this.editId = item.id;
    this.searchForm.patchValue({
      code: item.code,
      name: item.name,
      category: item.category,
      severity: item.severity,
      module: item.module,
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

    const input: CreateUpdateDefectDto = this.searchForm.value;
    console.log('Sending data to server:', input);

    if (this.isEdit && this.editId) {
      this.defectService.update(this.editId, input).subscribe({
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
      this.defectService.create(input).subscribe({
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
    this.defectService.delete(id).subscribe({
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

  toggleEnabled(item: DefectDto): void {
    this.defectService.setEnabled(item.id, !item.isEnabled).subscribe({
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

  getCategoryText(category: number): string {
    const option = this.categoryOptions.find(o => o.value === category);
    return option ? option.label : '';
  }

  getSeverityText(severity: number): string {
    const option = this.severityOptions.find(o => o.value === severity);
    return option ? option.label : '';
  }

  getSeverityColor(severity: number): string {
    const colors: Record<number, string> = {
      1: 'green',
      2: 'orange',
      3: 'red',
      4: 'magenta'
    };
    return colors[severity] || 'default';
  }

  getModuleText(module: number): string {
    const option = this.moduleOptions.find(o => o.value === module);
    return option ? option.label : '';
  }
}
