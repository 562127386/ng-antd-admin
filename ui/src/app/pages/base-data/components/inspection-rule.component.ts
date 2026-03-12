import { Component, OnInit, inject, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { InspectionRuleDto, CreateUpdateInspectionRuleDto } from '../models/quality-indicator.model';
import { QualityIndicatorService } from '../services/quality-indicator.service';

@Component({
  selector: 'app-inspection-rule',
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
    NzSpaceModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    NzDividerModule
  ],
  templateUrl: './inspection-rule.component.html',
  styleUrls: ['./inspection-rule.component.less']
})
export class InspectionRuleComponent implements OnInit {
  private qualityIndicatorService = inject(QualityIndicatorService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(NzModalService);

  @Input() qualityIndicatorId: string | null = null;
  @Output() rulesChanged = new EventEmitter<InspectionRuleDto[]>();

  inspectionRules: InspectionRuleDto[] = [];
  loading = false;
  isModalVisible = false;
  currentRule: InspectionRuleDto | null = null;
  ruleForm!: FormGroup;

  severityLevels = [
    { label: '严重', value: '严重' },
    { label: '一般', value: '一般' },
    { label: '轻微', value: '轻微' }
  ];

  ngOnInit(): void {
    this.initForm();
    if (this.qualityIndicatorId) {
      this.loadRules();
    }
  }

  initForm(): void {
    this.ruleForm = this.fb.group({
      name: ['', Validators.required],
      severityLevel: ['', Validators.required],
      priority: [0, Validators.required],
      conditionExpression: ['', Validators.required],
      judgmentResult: ['', Validators.required],
      description: ['', Validators.required],
      executeAction: ['', Validators.required],
      remark: ['']
    });
  }

  loadRules(): void {
    if (!this.qualityIndicatorId) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.qualityIndicatorService.getInspectionRules(this.qualityIndicatorId).subscribe({
      next: (rules: InspectionRuleDto[]) => {
        this.inspectionRules = rules;
        this.loading = false;
        this.cdr.markForCheck();
        this.rulesChanged.emit(rules);
      },
      error: () => {
        this.loading = false;
        this.messageService.error('加载判定规则失败');
        this.cdr.markForCheck();
      }
    });
  }

  showAddModal(): void {
    this.currentRule = null;
    this.ruleForm.reset({
      name: '',
      severityLevel: '',
      priority: 0,
      conditionExpression: '',
      judgmentResult: '',
      description: '',
      executeAction: '',
      remark: ''
    });
    this.isModalVisible = true;
  }

  showEditModal(rule: InspectionRuleDto): void {
    this.currentRule = rule;
    this.ruleForm.patchValue({
      name: rule.name,
      severityLevel: rule.severityLevel,
      priority: rule.priority,
      conditionExpression: rule.conditionExpression,
      judgmentResult: rule.judgmentResult,
      description: rule.description,
      executeAction: rule.executeAction,
      remark: rule.remark
    });
    this.isModalVisible = true;
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
    this.currentRule = null;
  }

  handleModalOk(): void {
    if (this.ruleForm.valid && this.qualityIndicatorId) {
      const data: CreateUpdateInspectionRuleDto = this.ruleForm.value;
      
      if (this.currentRule) {
        // Update
        this.qualityIndicatorService.updateInspectionRule(this.currentRule.id, data).subscribe({
          next: () => {
            this.messageService.success('更新判定规则成功');
            this.isModalVisible = false;
            this.loadRules();
          },
          error: () => {
            this.messageService.error('更新判定规则失败');
          }
        });
      } else {
        // Create
        this.qualityIndicatorService.createInspectionRule(this.qualityIndicatorId, data).subscribe({
          next: () => {
            this.messageService.success('创建判定规则成功');
            this.isModalVisible = false;
            this.loadRules();
          },
          error: () => {
            this.messageService.error('创建判定规则失败');
          }
        });
      }
    } else {
      Object.values(this.ruleForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteRule(id: string): void {
    this.qualityIndicatorService.deleteInspectionRule(id).subscribe({
      next: () => {
        this.messageService.success('删除判定规则成功');
        this.loadRules();
      },
      error: () => {
        this.messageService.error('删除判定规则失败');
      }
    });
  }

  getSeverityColor(level: string): string {
    switch (level) {
      case '严重': return 'error';
      case '一般': return 'warning';
      case '轻微': return 'success';
      default: return 'default';
    }
  }

  trackByRuleId(index: number, rule: InspectionRuleDto): string {
    return rule.id;
  }
}
