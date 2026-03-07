export enum NonConformingStatus {
  PendingReview = 1,
  Reviewing = 2,
  PendingDisposal = 3,
  Disposing = 4,
  Completed = 5
}

export enum InspectionStatus {
  Draft = 0,
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4
}

export enum InspectionResult {
  Accepted = 1,
  Concession = 2,
  Rejected = 3,
  Sorting = 4
}

export enum ItemJudgment {
  Pending = 0,
  OK = 1,
  NG = 2
}

export enum ReviewResult {
  Rework = 1,
  Repair = 2,
  Concession = 3,
  Scrap = 4
}

export enum DefectSeverity {
  Minor = 1,
  Moderate = 2,
  Major = 3,
  Critical = 4
}

export enum InspectionType {
  IQC = 1,
  IPQC = 2,
  FQC = 3,
  OQC = 4
}

export enum SamplingSchemeType {
  AQL = 1,
  CZero = 2,
  Variable = 3,
  Continuous = 4,
  SkipLot = 5
}
