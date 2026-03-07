import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { GeneralInspectionItemDto, CreateUpdateGeneralInspectionItemDto } from '../models/general-inspection-item.model';
import { GeneralInspectionItemService } from '../services/general-inspection-item.service';

@Component({
  selector: 'app-general-inspection-items',
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
    NzPopconfirmModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    NzCheckboxModule
  ],
  templateUrl: './general-inspection-items.component.html',
  styleUrls: ['./general-inspection-items.component.less']
})
export class GeneralInspectionItemsComponent implements OnInit {
  private generalInspectionItemService = inject(GeneralInspectionItemService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(NzModalService);

  loading = false;
  data: GeneralInspectionItemDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;
  modalForm!: FormGroup;
  isModalVisible = false;
  currentItem: GeneralInspectionItemDto | null = null;

  inspectionContents = [
    { label: '包装', value: '包装' },
    { label: '标示', value: '标示' },
    { label: '外观', value: '外观' },
    { label: '数量', value: '数量' },
    { label: '丝印', value: '丝印' },
    { label: '尺寸', value: '尺寸' },
    { label: '部品', value: '部品' }
  ];

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: ['']
    });

    this.modalForm = this.fb.group({
      inspectionContent: ['', Validators.required],
      inspectionItemName: ['', Validators.required],
      defectItem: ['', Validators.required],
      defectStatus: ['', Validators.required],
      isCritical: [false],
      isMajor: [false],
      isMinor: [false],
      remark: [''],
      sortOrder: [0]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.generalInspectionItemService.getList({
      skipCount: (this.pageIndex - 1) * this.pageSize,
      maxResultCount: this.pageSize,
      sorting: 'sortOrder asc'
    }).subscribe({
      next: (result: { items: any[]; totalCount: number }) => {
        this.data = result.items;
        this.total = result.totalCount;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.messageService.error('加载数据失败');
        this.cdr.markForCheck();
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
    this.currentItem = null;
    this.modalForm.reset({
      inspectionContent: '',
      inspectionItemName: '',
      defectItem: '',
      defectStatus: '',
      isCritical: false,
      isMajor: false,
      isMinor: false,
      remark: '',
      sortOrder: 0
    });
    this.isModalVisible = true;
  }

  showEditModal(item: GeneralInspectionItemDto): void {
    this.currentItem = item;
    this.modalForm.patchValue({
      inspectionContent: item.inspectionContent,
      inspectionItemName: item.inspectionItemName,
      defectItem: item.defectItem,
      defectStatus: item.defectStatus,
      isCritical: item.isCritical,
      isMajor: item.isMajor,
      isMinor: item.isMinor,
      remark: item.remark,
      sortOrder: item.sortOrder
    });
    this.isModalVisible = true;
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  handleModalOk(): void {
    if (this.modalForm.valid) {
      const data: CreateUpdateGeneralInspectionItemDto = this.modalForm.value;
      
      if (this.currentItem) {
        // Update
        this.generalInspectionItemService.update(this.currentItem.id, data).subscribe({
          next: () => {
            this.messageService.success('更新成功');
            this.isModalVisible = false;
            this.loadData();
          },
          error: () => {
            this.messageService.error('更新失败');
          }
        });
      } else {
        // Create
        this.generalInspectionItemService.create(data).subscribe({
          next: () => {
            this.messageService.success('创建成功');
            this.isModalVisible = false;
            this.loadData();
          },
          error: () => {
            this.messageService.error('创建失败');
          }
        });
      }
    } else {
      Object.values(this.modalForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteItem(id: string): void {
    this.generalInspectionItemService.deleteById(id).subscribe({
      next: () => {
        this.messageService.success('删除成功');
        this.loadData();
      },
      error: () => {
        this.messageService.error('删除失败');
      }
    });
  }

  getJudgmentTags(item: GeneralInspectionItemDto): string[] {
    const tags = [];
    if (item.isCritical) tags.push('CR');
    if (item.isMajor) tags.push('MAJ');
    if (item.isMinor) tags.push('MIN');
    return tags;
  }

  getTagColor(tag: string): string {
    switch (tag) {
      case 'CR': return 'error';
      case 'MAJ': return 'warning';
      case 'MIN': return 'success';
      default: return 'default';
    }
  }
}
