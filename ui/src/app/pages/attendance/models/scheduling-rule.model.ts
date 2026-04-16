export interface SchedulingRule {
  id: string;
  ruleName: string;
  description: string;
  isSizeRest: boolean;
  cycleDays: number;
  workDayPattern: string;
  departmentIds: string;
  employeeIds: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  creatorId: string;
  creationTime: string;
  lastModifierId: string;
  lastModificationTime: string;
  deleterId: string;
  deletionTime: string;
  isDeleted: boolean;
}
