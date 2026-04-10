import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CoreModule } from '@abp/ng.core';
import {
  DynamicListService,
  ConfigSchemeService,
  ExportService
} from '../../services';
import {
  ColumnConfig,
  FilterConfigScheme,
  TableConfigScheme,
  QueryParams,
  PagedResult
} from '../../models';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { InjectionToken } from '@angular/core';
import { NgxValidateCoreModule } from '@ngx-validate/core';
// 定义缺失的令牌（复制即可）
//const VALIDATION_BLUEPRINTS = new InjectionToken('validation.blueprints');
  import { VALIDATION_BLUEPRINTS } from '@ngx-validate/core';
 // const VALIDATION_BLUEPRINTS = new InjectionToken('validation.blueprints');
const VALIDATION_INVALID_CLASSES = new InjectionToken('validation.invalid.classes');
const VALIDATION_VALID_CLASSES = new InjectionToken('validation.valid.classes');
@Component({
  selector: 'abp-dynamic-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    NgxValidateCoreModule,
    //A11yModule,
    NzButtonModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCardModule,
    NzSpaceModule,
    NzDividerModule,
    NzIconModule,
    NzDropDownModule,
    NzTooltipModule,
    NzEmptyModule,
    NzPopconfirmModule,
    NzCollapseModule,
    NzCheckboxModule
  ],

  providers: [
    { provide: VALIDATION_BLUEPRINTS, useValue: [] },
    { provide: VALIDATION_INVALID_CLASSES, useValue: ['is-invalid'] },
    { provide: VALIDATION_VALID_CLASSES, useValue: ['is-valid'] },
  ],
  templateUrl: './dynamic-list.component.html',
  styles: [`
    .filter-container {
      padding: 8px 0;
    }
    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class DynamicListComponent implements OnInit, OnDestroy {
  @Input() entityName: string = '';
  @Input() apiUrl: string = '';
  @Input() columns: ColumnConfig[] = [];
  @Input() filterSchemes: FilterConfigScheme[] = [];
  @Input() tableSchemes?: TableConfigScheme;//[] = [];

  @Output() onCreate = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onQueryChange = new EventEmitter<QueryParams>();

  data: any[] = [];
  totalCount = 0;
  pageIndex = 1;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50, 100];
  loading = false;

  filterParams: QueryParams = {};
  activeFilters: any[] = [];

  // Batch operations
  selectedRowKeys: any[] = [];
  allChecked = false;

  private searchSubject = new Subject<QueryParams>();
  private subscription?: Subscription;
  private destroy$ = new Subject<void>();
  private isLoading = false;

  get visibleColumns(): ColumnConfig[] {
    return this.columns.filter(col => col.visible);
  }

  sortFn = (a: any, b: any) => {
    return a.value > b.value ? 1 : -1;
  };

  constructor(
    private dynamicListService: DynamicListService,
    private configSchemeService: ConfigSchemeService,
    private exportService: ExportService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(params => {
      this.loadData();
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadFilterSchemes();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    // debugger;
    // console.log('9999999999999999');
    if (!this.apiUrl || this.isLoading) return;

    this.isLoading = true;
    this.loading = true;
    const skipCount = (this.pageIndex - 1) * this.pageSize;

    this.dynamicListService.updateFilters(this.filterParams);
    this.dynamicListService.updatePage(skipCount, this.pageSize);

    this.dynamicListService.loadData(this.apiUrl, this.entityName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: PagedResult) => {
          this.data = result.items;
          this.totalCount = result.totalCount;
          this.loading = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadFilterSchemes(): void {
    if (!this.entityName) return;

    this.configSchemeService.getFilterSchemes(this.entityName).subscribe(schemes => {
        this.filterSchemes = schemes;
      const defaultScheme = schemes.find(s => s.isDefault);
      if (defaultScheme) {
        this.applyFilterScheme(defaultScheme);
      }
    });
  }


  //明天继续
  loadTableSchemes(): void {
    if (!this.entityName) return;
    this.configSchemeService.getTableScheme(this.entityName).subscribe(schemes => {
        this.tableSchemes = schemes;
        this.applyColumnScheme(this.tableSchemes);
      // const defaultScheme = schemes.find(s => s.isDefault);
      // if (defaultScheme) {
      //   this.applyFilterScheme(defaultScheme);
      // }
    });
  }
  applyColumnScheme(scheme: TableConfigScheme): void {
    this.columns = [];
    this.columns =scheme.columns;
  }



  search(): void {
    this.searchSubject.next(this.filterParams);
  }

  reset(): void {
    this.filterParams = {};
    this.search();
  }

  refresh(): void {
    this.loadData();
  }

  create(): void {
    this.onCreate.emit();
  }

  edit(row: any): void {
    this.onEdit.emit(row);
  }

  delete(row: any): void {
    this.onDelete.emit(row);
  }

  applyFilterScheme(scheme: FilterConfigScheme): void {
    this.filterParams = {};
    scheme.filters.forEach(filter => {
      this.filterParams[filter.field] = filter.value;
    });
    this.search();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (params.sort.length > 0) {
      const sort = params.sort[0];
      const sortStr = `${sort.key} ${sort.value === 'ascend' ? 'asc' : 'desc'}`;
      this.dynamicListService.updateSort(sortStr);
    }
    this.loadData();
  }

  updateColumnVisibility(): void {
    // Save column visibility to config
  }

  // Batch operations methods
  isSelected(row: any): boolean {
    return this.selectedRowKeys.includes(row.id || row);
  }

  onCheckRowChange(event: any, row: any): void {
    const checked = event.target?.checked || false;
    const key = row.id || row;
    if (checked) {
      this.selectedRowKeys.push(key);
    } else {
      this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== key);
    }
    this.updateAllChecked();
  }

  onCheckAllChange(event: any): void {
    const checked = event.target?.checked || false;
    this.allChecked = checked;
    this.selectedRowKeys = checked ? this.data.map(item => item.id || item) : [];
  }

  onSelectionChange(event: any): void {
    this.selectedRowKeys = event;
    this.updateAllChecked();
  }

  updateAllChecked(): void {
    this.allChecked = this.data.length > 0 && this.selectedRowKeys.length === this.data.length;
  }

  batchDelete(): void {
    if (this.selectedRowKeys.length > 0) {
      this.onDelete.emit(this.selectedRowKeys);
      this.selectedRowKeys = [];
      this.allChecked = false;
    }
  }

  batchExport(): void {
    if (this.selectedRowKeys.length > 0) {
      // Get selected data
      const selectedData = this.data.filter(item => {
        const key = item.id || item;
        return this.selectedRowKeys.includes(key);
      });
      
      // Export selected data
      this.exportService.exportToExcel(selectedData, this.visibleColumns, this.entityName || 'export');
    } else {
      // Export all data
      this.exportService.exportToExcel(this.data, this.visibleColumns, this.entityName || 'export');
    }
  }

  // Performance optimization
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
