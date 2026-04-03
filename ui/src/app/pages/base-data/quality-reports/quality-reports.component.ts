import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { IqcInspectionOrderDto, GetIqcInspectionOrderListDto } from '../models/iqc-inspection.model';
import { IqcInspectionService } from '../services/iqc-inspection.service';
import { InspectionStatus, InspectionResult, ItemJudgment } from '../models/enums';

@Component({
  selector: 'app-quality-reports',
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
    NzDatePickerModule,
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzDividerModule,
    NzDescriptionsModule,
    NzGridModule,
    NzStatisticModule,
    NzAlertModule,
    NzTabsModule,
    NgxEchartsModule
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  templateUrl: './quality-reports.component.html',
  styleUrls: ['./quality-reports.component.less']
})
export class QualityReportsComponent implements OnInit {
  private iqcInspectionService = inject(IqcInspectionService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  filterForm!: FormGroup;
  inspections: IqcInspectionOrderDto[] = [];
  
  totalInspections = 0;
  passCount = 0;
  failCount = 0;
  concessionCount = 0;
  sortingCount = 0;
  passRate = 0;

  resultPieChartOptions: NzSafeAny;
  trendChartOptions: NzSafeAny;
  itemPassRateChartOptions: NzSafeAny;

  statusOptions = [
    { label: '全部', value: null },
    { label: '草稿', value: InspectionStatus.Draft },
    { label: '待检验', value: InspectionStatus.Pending },
    { label: '检验中', value: InspectionStatus.InProgress },
    { label: '已完成', value: InspectionStatus.Completed },
    { label: '已取消', value: InspectionStatus.Cancelled }
  ];

  resultOptions = [
    { label: '全部', value: null },
    { label: '合格', value: InspectionResult.Accepted },
    { label: '特采', value: InspectionResult.Concession },
    { label: '不合格', value: InspectionResult.Rejected },
    { label: '挑选', value: InspectionResult.Sorting }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.initCharts();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      filter: [''],
      status: [null],
      result: [null],
      dateRange: [null]
    });
  }

  loadData(): void {
    this.loading = true;
    this.cdr.markForCheck();

    const input: GetIqcInspectionOrderListDto = {
      filter: this.filterForm.value.filter,
      status: this.filterForm.value.status,
      result: this.filterForm.value.result,
      startDate: this.filterForm.value.dateRange ? this.filterForm.value.dateRange[0] : null,
      endDate: this.filterForm.value.dateRange ? this.filterForm.value.dateRange[1] : null,
      maxResultCount: 1000
    };

    this.iqcInspectionService.getList(input).subscribe({
      next: (result) => {
        this.inspections = result.items;
        this.calculateStatistics();
        this.updateCharts();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  calculateStatistics(): void {
    const completedInspections = this.inspections.filter(i => i.status === InspectionStatus.Completed);
    this.totalInspections = completedInspections.length;
    
    this.passCount = completedInspections.filter(i => i.result === InspectionResult.Accepted).length;
    this.failCount = completedInspections.filter(i => i.result === InspectionResult.Rejected).length;
    this.concessionCount = completedInspections.filter(i => i.result === InspectionResult.Concession).length;
    this.sortingCount = completedInspections.filter(i => i.result === InspectionResult.Sorting).length;
    
    this.passRate = this.totalInspections > 0 ? Math.round((this.passCount / this.totalInspections) * 100) : 0;
  }

  initCharts(): void {
    this.resultPieChartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '检验结果',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          data: []
        }
      ]
    };

    this.trendChartOptions = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['合格', '不合格', '特采', '挑选']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '合格',
          type: 'line',
          stack: 'Total',
          data: []
        },
        {
          name: '不合格',
          type: 'line',
          stack: 'Total',
          data: []
        },
        {
          name: '特采',
          type: 'line',
          stack: 'Total',
          data: []
        },
        {
          name: '挑选',
          type: 'line',
          stack: 'Total',
          data: []
        }
      ]
    };

    this.itemPassRateChartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: []
      },
      series: [
        {
          name: '合格率',
          type: 'bar',
          data: [],
          itemStyle: {
            color: (params: NzSafeAny) => {
              return params.value >= 90 ? '#52c41a' : params.value >= 70 ? '#faad14' : '#ff4d4f';
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%'
          }
        }
      ]
    };
  }

  updateCharts(): void {
    const completedInspections = this.inspections.filter(i => i.status === InspectionStatus.Completed);
    
    this.resultPieChartOptions.series[0].data = [
      { value: this.passCount, name: '合格', itemStyle: { color: '#52c41a' } },
      { value: this.failCount, name: '不合格', itemStyle: { color: '#ff4d4f' } },
      { value: this.concessionCount, name: '特采', itemStyle: { color: '#faad14' } },
      { value: this.sortingCount, name: '挑选', itemStyle: { color: '#1890ff' } }
    ];

    const monthlyData = this.getMonthlyData(completedInspections);
    this.trendChartOptions.xAxis.data = monthlyData.months;
    this.trendChartOptions.series[0].data = monthlyData.pass;
    this.trendChartOptions.series[1].data = monthlyData.fail;
    this.trendChartOptions.series[2].data = monthlyData.concession;
    this.trendChartOptions.series[3].data = monthlyData.sorting;

    const itemData = this.getItemPassRateData(completedInspections);
    this.itemPassRateChartOptions.yAxis.data = itemData.items;
    this.itemPassRateChartOptions.series[0].data = itemData.rates;

    this.resultPieChartOptions = { ...this.resultPieChartOptions };
    this.trendChartOptions = { ...this.trendChartOptions };
    this.itemPassRateChartOptions = { ...this.itemPassRateChartOptions };
  }

  getMonthlyData(inspections: IqcInspectionOrderDto[]): any {
    const months: string[] = [];
    const pass: number[] = [];
    const fail: number[] = [];
    const concession: number[] = [];
    const sorting: number[] = [];

    const monthMap = new Map<string, { pass: number; fail: number; concession: number; sorting: number }>();

    inspections.forEach(inspection => {
      if (inspection.startInspectionTime) {
        const date = new Date(inspection.startInspectionTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, { pass: 0, fail: 0, concession: 0, sorting: 0 });
        }

        const monthData = monthMap.get(monthKey)!;
        switch (inspection.result) {
          case InspectionResult.Accepted:
            monthData.pass++;
            break;
          case InspectionResult.Rejected:
            monthData.fail++;
            break;
          case InspectionResult.Concession:
            monthData.concession++;
            break;
          case InspectionResult.Sorting:
            monthData.sorting++;
            break;
        }
      }
    });

    const sortedMonths = Array.from(monthMap.keys()).sort();
    sortedMonths.forEach(month => {
      months.push(month);
      const data = monthMap.get(month)!;
      pass.push(data.pass);
      fail.push(data.fail);
      concession.push(data.concession);
      sorting.push(data.sorting);
    });

    return { months, pass, fail, concession, sorting };
  }

  getItemPassRateData(inspections: IqcInspectionOrderDto[]): any {
    const itemStats = new Map<string, { total: number; pass: number }>();

    inspections.forEach(inspection => {
      if (inspection.records) {
        inspection.records.forEach(record => {
          const key = `${record.itemCode} ${record.itemName}`;
          if (!itemStats.has(key)) {
            itemStats.set(key, { total: 0, pass: 0 });
          }
          const stats = itemStats.get(key)!;
          stats.total++;
          if (record.judgment === ItemJudgment.OK) {
            stats.pass++;
          }
        });
      }
    });

    const items: string[] = [];
    const rates: number[] = [];

    itemStats.forEach((stats, item) => {
      items.push(item);
      rates.push(stats.total > 0 ? Math.round((stats.pass / stats.total) * 100) : 0);
    });

    const sortedData = items.map((item, index) => ({ item, rate: rates[index] }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 10);

    return {
      items: sortedData.map(d => d.item),
      rates: sortedData.map(d => d.rate)
    };
  }

  onSearch(): void {
    this.loadData();
  }

  onReset(): void {
    this.filterForm.reset();
    this.loadData();
  }

  getStatusText(status: number): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : '';
  }

  getStatusColor(status: number): string {
    switch (status) {
      case InspectionStatus.Draft:
        return 'default';
      case InspectionStatus.Pending:
        return 'processing';
      case InspectionStatus.InProgress:
        return 'warning';
      case InspectionStatus.Completed:
        return 'success';
      case InspectionStatus.Cancelled:
        return 'error';
      default:
        return 'default';
    }
  }

  getResultText(result?: number): string {
    if (result === undefined || result === null) return '';
    const option = this.resultOptions.find(o => o.value === result);
    return option ? option.label : '';
  }

  getResultColor(result?: number): string {
    if (result === undefined || result === null) return 'default';
    switch (result) {
      case InspectionResult.Accepted:
        return 'success';
      case InspectionResult.Rejected:
        return 'error';
      case InspectionResult.Concession:
        return 'warning';
      case InspectionResult.Sorting:
        return 'processing';
      default:
        return 'default';
    }
  }
}
