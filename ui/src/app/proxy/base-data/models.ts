import type { InspectionResult } from '../enums/inspection-result.enum';
import type { ReviewResult } from '../enums/review-result.enum';

export interface NonConformingsController_CompleteDisposalInput {
  reInspectionResult?: InspectionResult | null;
}

export interface NonConformingsController_CompleteReviewInput {
  reviewResult?: ReviewResult;
  reworkQty?: number | null;
  repairQty?: number | null;
  scrapQty?: number | null;
  responsiblePerson?: string | null;
  responsibleDept?: string | null;
  responsibleSupplier?: string | null;
}

export interface RuleEvaluationResult {
  ruleId?: string;
  ruleName?: string;
  conditionExpression?: string;
  judgmentResult?: string;
  isPassed?: boolean;
  evaluationDetail?: string | null;
  actualValue?: string | null;
  formattedExpression?: string | null;
}
