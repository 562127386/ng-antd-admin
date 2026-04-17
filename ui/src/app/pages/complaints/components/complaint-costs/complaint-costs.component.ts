import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { ComplaintCost } from '../../models/complaint.model';
import { COST_CATEGORY_NAMES, CostType } from '../../models/enums';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-complaint-costs',
  templateUrl: './complaint-costs.component.html',
  styleUrls: ['./complaint-costs.component.less'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzStatisticModule
  ],
  standalone: true
})
export class ComplaintCostsComponent implements OnInit {
  @Input() complaintId!: string;

  costs: ComplaintCost[] = [];
  loading = false;
  totalCost = 0;

  isModalVisible = false;
  editingCostId: string | null = null;
  costForm: FormGroup;

  costCategoryOptions = Object.entries(COST_CATEGORY_NAMES).map(([value, label]) => ({ value: Number(value), label }));

  constructor(
    private complaintService: ComplaintService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.costForm = this.fb.group({
      costType: [CostType.Direct, [Validators.required]],
      costCategory: [null, [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCosts();
  }

  loadCosts(): void {
    this.loading = true;
    this.complaintService.getCosts(this.complaintId).subscribe({
      next: (result:any) => {
        this.costs = result.items;
        this.totalCost = this.costs.reduce((sum, c) => sum + (c.amount || 0), 0);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingCostId = null;
    this.costForm.reset({ costType: CostType.Direct, amount: 0 });
    this.isModalVisible = true;
  }

  openEditModal(cost: ComplaintCost): void {
    this.editingCostId = cost.id || null;
    this.costForm.patchValue(cost);
    this.isModalVisible = true;
  }

  handleModalOk(): void {
    if (this.costForm.invalid) return;

    const data = this.costForm.value;
    if (this.editingCostId) {
      this.complaintService.updateCost(this.complaintId, this.editingCostId, data).subscribe({
        next: () => {
          this.message.success('更新成功');
          this.loadCosts();
          this.isModalVisible = false;
        },
        error: () => this.message.error('更新失败')
      });
    } else {
      this.complaintService.createCost(this.complaintId, data).subscribe({
        next: () => {
          this.message.success('创建成功');
          this.loadCosts();
          this.isModalVisible = false;
        },
        error: () => this.message.error('创建失败')
      });
    }
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  deleteCost(costId: string): void {
    this.complaintService.deleteCost(this.complaintId, costId).subscribe({
      next: () => {
        this.message.success('删除成功');
        this.loadCosts();
      },
      error: () => this.message.error('删除失败')
    });
  }
}
