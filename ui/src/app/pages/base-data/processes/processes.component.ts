import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef, inject, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { ProcessDto, CreateUpdateProcessDto, GetProcessListDto } from '../models/process.model';
import { ProcessService } from '../services/process.service';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    NzGridModule,
    NzCardModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    AntTableComponent,
    NzSwitchModule,
    NzModalModule,
    NzPopconfirmModule,
    NzSpaceModule
  ]
})
export class ProcessesComponent implements OnInit {
  readonly operationTpl = viewChild.required<TemplateRef<NzSafeAny>>('operationTpl');
  
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '工序管理',
    breadcrumb: ['首页', '基础数据', '工序管理'],
    desc: ''
  };
  dataList: ProcessDto[] = [];
  checkedCashArray: ProcessDto[] = [];
  isCollapse = true;
  filterForm!: { filter: string; isEnabled: boolean | null };
  isModalVisible = false;
  isEdit = false;
  editId?: string;
  searchFormData: CreateUpdateProcessDto = {} as CreateUpdateProcessDto;
  destroyRef = inject(DestroyRef);

  private processService = inject(ProcessService);
  private modalSrv = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);

  selectedChecked(e: ProcessDto[]): void {
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.filterForm = { filter: '', isEnabled: null };
    this.getDataList({ pageIndex: 1 });
  }

  getDataList(e?: { pageIndex: number }): void {
    this.tableConfig.loading = true;
    const input: GetProcessListDto = {
      filter: this.filterForm.filter,
      isEnabled: this.filterForm.isEnabled ?? undefined,
      skipCount: ((e?.pageIndex || this.tableConfig.pageIndex) - 1) * this.tableConfig.pageSize!,
      maxResultCount: this.tableConfig.pageSize!
    };

    this.processService.getList(input).pipe(
      finalize(() => this.tableLoading(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.dataList = result.items || [];
      this.tableConfig.total = result.totalCount || 0;
      this.tableConfig.pageIndex = e?.pageIndex || this.tableConfig.pageIndex;
      this.tableLoading(false);
    });
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  add(): void {
    this.isEdit = false;
    this.editId = undefined;
    this.searchFormData = { code: '', name: '', workshop: '', description: '', isEnabled: true };
    this.isModalVisible = true;
  }

  reloadTable(): void {
    this.message.info('刷新成功');
    this.getDataList();
  }

  edit(id: string, dataItem: ProcessDto): void {
    this.isEdit = true;
    this.editId = id;
    this.searchFormData = {
      code: dataItem.code,
      name: dataItem.name,
      workshop: dataItem.workshop,
      description: dataItem.description || '',
      isEnabled: dataItem.isEnabled
    };
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
    this.cdr.markForCheck();
  }

  handleOk(): void {
    if (!this.searchFormData.code || !this.searchFormData.name || !this.searchFormData.workshop) {
      this.message.error('请填写必填项');
      return;
    }

    if (this.isEdit && this.editId) {
      this.tableLoading(true);
      this.processService.update(this.editId, this.searchFormData).pipe(
        finalize(() => this.tableLoading(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.message.success('更新成功');
        this.isModalVisible = false;
        this.getDataList();
      });
    } else {
      this.tableLoading(true);
      this.processService.create(this.searchFormData).pipe(
        finalize(() => this.tableLoading(false)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.message.success('创建成功');
        this.isModalVisible = false;
        this.getDataList();
      });
    }
  }

  del(id: string): void {
    this.modalSrv.confirm({
      nzTitle: '确定要删除吗？',
      nzContent: '删除后不可恢复',
      nzOnOk: () => {
        this.tableLoading(true);
        this.processService.delete(id).pipe(
          finalize(() => this.tableLoading(false)),
          takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
          if (this.dataList.length === 1 && this.tableConfig.pageIndex !== 1) {
            this.tableConfig.pageIndex--;
          }
          this.getDataList();
        });
      }
    });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  ngOnInit(): void {
    this.filterForm = { filter: '', isEnabled: null };
    this.initTable();
    this.getDataList();
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        { title: '工序编码', field: 'code', width: 120 },
        { title: '工序名称', field: 'name', width: 150 },
        { title: '车间', field: 'workshop', width: 120 },
        { title: '描述', field: 'description', width: 200 },
        { title: '状态', field: 'isEnabled', width: 80, fieldType: 'switch' },
        { title: '操作', tdTemplate: this.operationTpl(), width: 120, fixed: true }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
