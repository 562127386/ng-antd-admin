import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LookupConfigScheme, LookupColumnConfig, LookupSearchFilter } from '../../models';
import { RecentUsageService } from '../../services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'abp-lookup-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    NzDividerModule
  ],
  template: `
    <nz-select
      [ngModel]="value"
      (ngModelChange)="onValueChange($event)"
      [nzShowSearch]="true"
      [nzServerSearch]="serverSearch"
      (nzOnSearch)="onSearch($event)"
      [nzDisabled]="disabled"
      [nzPlaceHolder]="placeholder"
      [nzMode]="isMulti ? 'multiple' : 'default'"
      [nzAllowClear]="true"
      (nzOpenChange)="onOpenChange($event)"
      style="width: 100%;">
      <!-- Recent Items -->
      <ng-container *ngIf="showRecent && recentItems.length > 0 && !searchValue">
        <nz-option nzDisabled nzCustomContent>
          <span style="font-weight: bold; color: #999;">最近使用</span>
        </nz-option>
        <nz-option
          *ngFor="let item of recentItems"
          [nzValue]="item[valueField]"
          [nzLabel]="item[displayField]">
        </nz-option>
        <nz-divider *ngIf="options.length > 0"></nz-divider>
      </ng-container>
      
      <!-- Regular Options -->
      <nz-option
        *ngFor="let option of options"
        [nzValue]="option[valueField]"
        [nzLabel]="option[displayField]">
      </nz-option>
      <nz-option *ngIf="loading" nzDisabled nzCustomContent>
        <span nz-icon nzType="loading" class="loading-icon"></span>
        加载中...
      </nz-option>
    </nz-select>
  `,
  styles: [`
    .loading-icon {
      display: inline-block;
      animation: rotating 1s linear infinite;
    }
    @keyframes rotating {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class LookupSelectComponent implements OnInit, OnChanges {
  @Input() value: any | any[] = null;
  @Input() apiUrl: string = '';
  @Input() displayField: string = 'name';
  @Input() valueField: string = 'id';
  @Input() placeholder: string = '请选择';
  @Input() disabled: boolean = false;
  @Input() isMulti: boolean = false;
  @Input() serverSearch: boolean = true;
  @Input() params: Record<string, any> = {};
  @Input() entityName: string = '';
  @Input() showRecent: boolean = true;

  @Output() valueChange = new EventEmitter<any | any[]>();

  options: any[] = [];
  recentItems: any[] = [];
  loading = false;
  searchValue = '';

  private lastSearchValue = '';
  private searchTimeout: any;

  constructor(
    private http: HttpClient,
    private recentUsageService: RecentUsageService
  ) {}

  ngOnInit(): void {
    if (!this.serverSearch && this.apiUrl) {
      this.loadOptions();
    }
    if (this.showRecent && this.entityName) {
      this.loadRecentItems();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      if (this.value && !this.serverSearch) {
        this.loadSelectedValue();
      }
    }
  }

  onSearch(value: string): void {
    this.searchValue = value;

    if (value !== this.lastSearchValue) {
      this.lastSearchValue = value;
      
      // Debounce search to avoid frequent API calls
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadOptions();
      }, 300);
    }
  }

  onValueChange(value: any | any[]): void {
    this.valueChange.emit(value);
    if (this.showRecent && this.entityName) {
      this.saveRecentItems(value);
    }
  }

  private loadRecentItems(): void {
    if (!this.entityName) return;
    
    const recentItems = this.recentUsageService.getRecentItemsForEntity(this.entityName);
    this.recentItems = recentItems.map(item => ({
      [this.valueField]: item.id,
      [this.displayField]: item.label
    }));
  }

  private saveRecentItems(value: any | any[]): void {
    if (!this.entityName) return;
    
    if (Array.isArray(value)) {
      value.forEach(val => {
        const option = this.options.find(opt => opt[this.valueField] === val);
        if (option) {
          this.recentUsageService.addRecentItem(
            val,
            option[this.displayField],
            this.entityName
          );
        }
      });
    } else {
      const option = this.options.find(opt => opt[this.valueField] === value);
      if (option) {
        this.recentUsageService.addRecentItem(
          value,
          option[this.displayField],
          this.entityName
        );
      }
    }
    
    this.loadRecentItems();
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimeout);
  }

  onOpenChange(open: boolean): void {
    if (open && this.options.length === 0) {
      this.loadOptions();
    }
  }

  private loadOptions(): void {
    if (!this.apiUrl) return;

    this.loading = true;
    let params = new HttpParams();

    if (this.searchValue) {
      params = params.set('Filter', this.searchValue);
      params = params.set(`${this.displayField}.contains`, this.searchValue);
    }

    Object.keys(this.params).forEach(key => {
      params = params.set(key, this.params[key]);
    });

    this.http.get<{ items: any[] }>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.options = response.items || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private loadSelectedValue(): void {
    if (!this.value || !this.apiUrl) return;

    const ids = Array.isArray(this.value) ? this.value : [this.value];
    if (ids.length === 0) return;

    let params = new HttpParams();
    params = params.set('ids', ids.join(','));

    this.http.get<{ items: any[] }>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.options = response.items || [];
      }
    });
  }
}

@Component({
  selector: 'abp-lookup-typeahead',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzAutocompleteModule
  ],
  template: `
    <nz-autocomplete
      [nzDataSource]="filteredData"
      [nzBackfill]="true"
      (nzSelect)="onSelect($event)"
      (nzSearch)="onSearch($event)"
      style="width: 100%;">
      <nz-auto-option
        *ngFor="let item of filteredData"
        [nzValue]="item[valueField]"
        [nzLabel]="item[displayField]">
        {{ item[displayField] }}
      </nz-auto-option>
    </nz-autocomplete>
  `
})
export class LookupTypeaheadComponent implements OnInit {
  @Input() value: any | any[] = null;
  @Input() apiUrl: string = '';
  @Input() displayField: string = 'name';
  @Input() valueField: string = 'id';
  @Input() placeholder: string = '请输入搜索';
  @Input() disabled: boolean = false;
  @Input() minChars: number = 2;
  @Input() isMulti: boolean = false;

  @Output() valueChange = new EventEmitter<any | any[]>();

  filteredData: any[] = [];
  private searchSubject: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.value) {
      this.loadSelectedValue();
    }
  }

  onSearch(value: string | Event): void {
    const searchValue = typeof value === 'string' ? value : (value as any).target?.value || '';
    if (searchValue.length < this.minChars) {
      this.filteredData = [];
      return;
    }

    this.search(searchValue);
  }

  onSelect(event: any): void {
    const selected = this.filteredData.find(item => item[this.valueField] === event.nzValue);
    if (selected) {
      if (this.isMulti) {
        const currentValue = Array.isArray(this.value) ? [...this.value] : [];
        if (!currentValue.includes(selected[this.valueField])) {
          currentValue.push(selected[this.valueField]);
          this.valueChange.emit(currentValue);
        }
      } else {
        this.valueChange.emit(selected[this.valueField]);
      }
    }
  }

  private search(value: string): void {
    if (!this.apiUrl) return;

    let params = new HttpParams();
    params = params.set('Filter', value);
    params = params.set(`${this.displayField}.contains`, value);

    this.http.get<{ items: any[] }>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.filteredData = response.items || [];
      }
    });
  }

  private loadSelectedValue(): void {
    if (!this.value || !this.apiUrl) return;

    const ids = Array.isArray(this.value) ? this.value : [this.value];
    if (ids.length === 0) return;

    let params = new HttpParams();
    params = params.set('ids', ids.join(','));

    this.http.get<{ items: any[] }>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.filteredData = response.items || [];
      }
    });
  }
}
