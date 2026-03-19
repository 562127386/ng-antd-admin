import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  conditionExpression: string;
  ConditionExpression?: string;
  judgmentResult?: string;
  JudgmentResult?: string;
  isPassed: boolean;
  IsPassed?: boolean;
  evaluationDetail?: string;
  EvaluationDetail?: string;
  actualValue?: string;
  ActualValue?: string;
  referenceValue?: string;
  ReferenceValue?: string;
  operator?: string;
  Operator?: string;
  formattedExpression?: string;
  FormattedExpression?: string;
}

@Component({
  selector: 'app-judgment-rules-display',
  standalone: true,
  imports: [
    CommonModule,
    NzTagModule,
    NzTooltipModule,
    NzIconModule,
    NzBadgeModule
  ],
  template: `
    <div class="rules-display" *ngIf="rules && rules.length > 0">
      <ng-container *ngIf="rules.length === 1">
        <div  class="single-rule" [ngClass]="(rules[0].isPassed || rules[0].IsPassed) ? 'rule-passed' : 'rule-failed'">
          <nz-tag  [nzColor]="(rules[0].isPassed || rules[0].IsPassed) ? 'success' : 'error'">
            <span nz-icon [nzType]="(rules[0].isPassed || rules[0].IsPassed) ? 'check-circle' : 'close-circle'" 
                  [nzTheme]="'fill'"></span>
            {{ (rules[0].isPassed || rules[0].IsPassed) ? '校验通过' : '校验不通过' }}
          </nz-tag>
      <!--      <span class="rule-name">{{ rules[0].ruleName }}</span> -->
          <span class="rule-expression" *ngIf="getFormattedExpression(rules[0])">
            {{ getFormattedExpression(rules[0]) }}
          </span>
         <!-- <span class="rule-name">{{ (rules[0].JudgmentResult || rules[0].judgmentResult) }}</span> -->
        </div>
       <!-- <div class="rule-detail" *ngIf="rules[0].evaluationDetail">
          {{ rules[0].evaluationDetail }}
        </div> -->
      </ng-container>
      
      <ng-container *ngIf="rules.length > 1">
        <div class="rules-summary" [ngClass]="getSummaryClass()">
          <nz-badge [nzStatus]="getBadgeStatus()" [nzText]="getSummaryText()"></nz-badge>
        </div>
        <div class="rules-list" *ngIf="expanded">
          <div *ngFor="let rule of rules" class="rule-item" [ngClass]="(rule.isPassed || rule.IsPassed) ? 'rule-passed' : 'rule-failed'">
            <span nz-icon [nzType]="(rule.isPassed || rule.IsPassed) ? 'check-circle' : 'close-circle'" 
                  [nzTheme]="'fill'"
                  [style.color]="(rule.isPassed || rule.IsPassed) ? '#52c41a' : '#ff4d4f'"></span>
            <nz-tag  [nzColor]="(rule.isPassed || rule.IsPassed) ? 'success' : 'error'" nzMode="default">
              {{ (rule.isPassed || rule.IsPassed) ? '校验通过' : '校验不通过' }}
            </nz-tag>
          <!--    <span class="rule-name">{{ rule.ruleName }}</span> -->
            <span class="rule-expression" *ngIf="getFormattedExpression(rule)">
              {{ getFormattedExpression(rule) }}
            </span>
            <!--  <span class="rule-name">{{ (rule.JudgmentResult || rule.judgmentResult) }}</span> -->
          </div>
        </div>
        <div *ngIf="!expanded" class="rules-collapsed" (click)="toggleExpand()">
          <span style="cursor: pointer; color: #1890ff;">
            <span nz-icon nzType="down"></span>
            点击查看 {{ rules.length }} 条规则
          </span>
        </div>
      </ng-container>
    </div>
    <div *ngIf="!rules || rules.length === 0" class="no-rules">
      <nz-tag nzColor="default">待判定</nz-tag>
    </div>
  `,
  styles: [`
    .rules-display {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .single-rule {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .rule-passed {
      color: #52c41a;
    }
    .rule-failed {
      color: #ff4d4f;
    }
    .rule-name {
      font-weight: 500;
      color: #333;
    }
    .rule-expression {
      color: #666;
      font-size: 12px;
      background: #f5f5f5;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .rule-detail {
      font-size: 12px;
      color: #888;
      margin-left: 4px;
    }
    .rules-summary {
      display: flex;
      align-items: center;
    }
    .rules-list {
      margin-top: 8px;
      padding: 8px;
      background: #fafafa;
      border-radius: 4px;
    }
    .rule-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      font-size: 12px;
    }
    .rules-collapsed {
      margin-top: 4px;
      font-size: 12px;
    }
    .no-rules {
      display: flex;
      align-items: center;
    }
  `]
})
export class JudgmentRulesDisplayComponent {
  @Input() rules: RuleEvaluationResult[] = [];
  @Input() expanded = false;
  @Input() showDetails = true;

  private cdr = inject(ChangeDetectorRef);

  getFormattedExpression(rule: RuleEvaluationResult): string {
    const judgmentResult = rule.JudgmentResult || rule.judgmentResult;
    const formattedExpr = rule.formattedExpression || rule.FormattedExpression;
    if (formattedExpr) {
      return `${formattedExpr}  ${judgmentResult}`;
    }
    const conditionExpr = rule.conditionExpression || rule.ConditionExpression;
    if (conditionExpr) {
      return `${conditionExpr
        .replace(/value/gi, '实际值')
        .replace(/&&/g, ' 且 ')
        .replace(/\|\|/g, ' 或 ')}  ${judgmentResult}`;
    }
    const refValue = rule.referenceValue || rule.ReferenceValue;
    const op = rule.operator || rule.Operator;
    if (refValue && op) {
      const opText = this.getOperatorText(op);
      return `实际值 ${opText} ${refValue} ${judgmentResult}`;
    }
    return '';
  }

  private getOperatorText(op: string | undefined): string {
    const opMap: { [key: string]: string } = {
      '>': '>',
      '<': '<',
      '>=': '≥',
      '<=': '≤',
      '=': '=',
      '==': '=',
      '!=': '≠',
      'GT': '>',
      'LT': '<',
      'GE': '≥',
      'LE': '≤',
      'EQ': '='
    };
    return op ? (opMap[op.toUpperCase()] || op) : '';
  }

  getSummaryClass(): string {
    if (!this.rules || this.rules.length === 0) return '';
    const passedCount = this.rules.filter(r => r.isPassed || r.IsPassed).length;
    if (passedCount === this.rules.length) return 'all-passed';
    if (passedCount === 0) return 'all-failed';
    return 'some-passed';
  }

  getSummaryText(): string {
    if (!this.rules || this.rules.length === 0) return '待判定';
    const passedCount = this.rules.filter(r => r.isPassed || r.IsPassed).length;
    return `${passedCount}/${this.rules.length} 规则通过`;
  }

  getBadgeStatus(): string {
    if (!this.rules || this.rules.length === 0) return 'default';
    const passedCount = this.rules.filter(r => r.isPassed || r.IsPassed).length;
    if (passedCount === this.rules.length) return 'success';
    if (passedCount === 0) return 'error';
    return 'warning';
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
    this.cdr.markForCheck();
  }
}
