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
import { SupplierDto, CreateUpdateSupplierDto, GetSupplierListDto } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-suppliers',
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
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.less']
})
export class SuppliersComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  data: SupplierDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  editId?: string;

  statusOptions = [
    { label: '全部', value: null },
    { label: '启用', value: true },
    { label: '禁用', value: false }
  ];

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      isEnabled: [null]
    });

    this.searchForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      contactPerson: [''],
      contactPhone: [''],
      email: [''],
      address: [''],
      isEnabled: [true],
      sortOrder: [0],
      remark: ['']
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetSupplierListDto = {
      filter: this.filterForm.value.filter,
      isEnabled: this.filterForm.value.isEnabled,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.supplierService.getList(input).subscribe({
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

  showEditModal(item: SupplierDto): void {
    this.isEdit = true;
    this.editId = item.id;
    this.searchForm.patchValue({
      code: item.code,
      name: item.name,
      contactPerson: item.contactPerson,
      contactPhone: item.contactPhone,
      email: item.email,
      address: item.address,
      isEnabled: item.isEnabled,
      sortOrder: item.sortOrder,
      remark: item.remark
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

    const input: CreateUpdateSupplierDto = this.searchForm.value;

    if (this.isEdit && this.editId) {
      this.supplierService.update(this.editId, input).subscribe({
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
      this.supplierService.create(input).subscribe({
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
    this.supplierService.delete(id).subscribe({
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

  toggleEnabled(item: SupplierDto): void {
    this.supplierService.setEnabled(item.id, !item.isEnabled).subscribe({
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
}
