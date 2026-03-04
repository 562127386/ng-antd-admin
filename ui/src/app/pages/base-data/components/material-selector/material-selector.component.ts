import { Component, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { 
  MaterialDto, 
  GetMaterialListDto 
} from '../../models/material.model';
import { MaterialService } from '../../services/material.service';

@Component({
  selector: 'app-material-selector',
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
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule
  ],
  templateUrl: './material-selector.component.html',
  styleUrls: ['./material-selector.component.less']
})
export class MaterialSelectorComponent implements OnInit, OnChanges {
  private materialService = inject(MaterialService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() selected = new EventEmitter<MaterialDto>();

  loading = false;
  data: MaterialDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;

  statusOptions = [
    { label: '全部', value: null },
    { label: '启用', value: true },
    { label: '禁用', value: false }
  ];

  materialTypeOptions = [
    { label: '全部', value: null },
    { label: '原材料', value: 1 },
    { label: '半成品', value: 2 },
    { label: '成品', value: 3 }
  ];

  ngOnInit(): void {
    this.initForms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue) {
      this.pageIndex = 1;
      this.loadData();
    }
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      isEnabled: [true],
      materialType: [null]
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
      }
    });
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset(): void {
    this.filterForm.patchValue({
      filter: '',
      isEnabled: true,
      materialType: null
    });
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

  handleCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  selectMaterial(item: MaterialDto): void {
    this.selected.emit(item);
    this.visible = false;
    this.visibleChange.emit(false);
  }

  getMaterialTypeText(type: number): string {
    const option = this.materialTypeOptions.find(o => o.value === type);
    return option ? option.label : '';
  }
}
