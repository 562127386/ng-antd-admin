import type { DefectCategory } from '../../enums/defect-category.enum';
import type { DefectSeverity } from '../../enums/defect-severity.enum';
import type { InspectionType } from '../../enums/inspection-type.enum';
import type { FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateDefectDto {
  code: string;
  name: string;
  category: DefectCategory;
  severity: DefectSeverity;
  module: InspectionType;
  remark?: string | null;
  isEnabled?: boolean;
}

export interface DefectDto extends FullAuditedEntityDto<string> {
  code?: string;
  name?: string;
  category?: DefectCategory;
  severity?: DefectSeverity;
  module?: InspectionType;
  remark?: string | null;
  isEnabled?: boolean;
}

export interface GetDefectListDto extends PagedAndSortedResultRequestDto {
  filter?: string | null;
  category?: DefectCategory | null;
  severity?: DefectSeverity | null;
  module?: InspectionType | null;
  isEnabled?: boolean | null;
}
