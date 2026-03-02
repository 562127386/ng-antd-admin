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
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MaterialDto, CreateUpdateMaterialDto, GetMaterialListDto } from '../models/material.model';
import { MaterialService } from '../services/material.service';

@Component({
  selector: 'app-materials',
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
    NzTagModule,
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule
  ],
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.less']
})
export class MaterialsComponent implements OnInit {
  private materialService = inject(MaterialService);
  private fb = inject(FormBuilder);
  private modalService = inject(NzModalService);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  data: MaterialDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;
  editId?: string;

  materialTypeOptions = [
    { label: '原材料', value: 1 },
    { label: '半成品', value: 2 },
    { label: '成品', value: 3 }
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
      specification: [''],
      drawingNo: [''],
      materialType: [null, [Validators.required]],
      batchManagement: [false],
      expiryManagement: [false],
      supplier: [''],
      defaultStandardId: [''],
      isEnabled: [true]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetMaterialListDto = {
      filter: this.filterForm.value.filter,
      isEnabled: this.filterForm.value.isEnabled,
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize
    };

    this.materialService.getList(input).subscribe({
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
    this.searchForm.patchValue({
      batchManagement: false,
      expiryManagement: false
    });
    this.isModalVisible = true;
  }

  showEditModal(item: MaterialDto): void {
    this.isEdit = true;
    this.editId = item.id;
    this.searchForm.patchValue({
      code: item.code,
      name: item.name,
      specification: item.specification,
      drawingNo: item.drawingNo,
      materialType: item.materialType,
      batchManagement: item.batchManagement,
      expiryManagement: item.expiryManagement,
      supplier: item.supplier,
      defaultStandardId: item.defaultStandardId,
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

    const input: CreateUpdateMaterialDto = this.searchForm.value;

    if (this.isEdit && this.editId) {
      this.materialService.update(this.editId, input).subscribe({
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
      this.materialService.create(input).subscribe({
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
    this.materialService.delete(id).subscribe({
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

  getMaterialTypeText(type: number): string {
    const option = this.materialTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }
}
