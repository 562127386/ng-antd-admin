import { Component, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { 
  InspectionStandardDto, 
  GetInspectionStandardListDto 
} from '../../models/inspection-standard.model';
import { InspectionStandardService } from '../../services/inspection-standard.service';

@Component({
  selector: 'app-inspection-standard-selector',
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
    NzTagModule,
    NzPaginationModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule
  ],
  templateUrl: './inspection-standard-selector.component.html',
  styleUrls: ['./inspection-standard-selector.component.less']
})
export class InspectionStandardSelectorComponent implements OnInit, OnChanges {
  private inspectionStandardService = inject(InspectionStandardService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  @Input() visible = false;
  @Input() inspectionType?: number;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() selected = new EventEmitter<InspectionStandardDto>();

  loading = false;
  data: InspectionStandardDto[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  filterForm!: FormGroup;

  inspectionTypeOptions = [
    { label: 'IQC', value: 1 },
    { label: 'IPQC', value: 2 },
    { label: 'FQC', value: 3 },
    { label: 'OQC', value: 4 }
  ];

  statusOptions = [
    { label: '草稿', value: 1 },
    { label: '生效中', value: 2 },
    { label: '已失效', value: 3 }
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
      inspectionType: [this.inspectionType],
      status: [2]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const input: GetInspectionStandardListDto = {
      filter: this.filterForm.value.filter,
      status: this.filterForm.value.status,
      inspectionType: this.filterForm.value.inspectionType,
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
      inspectionType: this.inspectionType,
      status: 2
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

  selectStandard(item: InspectionStandardDto): void {
    this.selected.emit(item);
    this.visible = false;
    this.visibleChange.emit(false);
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
