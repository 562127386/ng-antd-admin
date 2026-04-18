export interface ColumnConfigDto {
  field?: string;
  headerName?: string;
  width?: string;
  sortable?: boolean;
}

export interface ColumnSchemaDto {
  id?: string;
  entityName?: string | null;
  fieldName?: string | null;
  headerName?: string | null;
  width?: number | null;
  isSortable?: boolean;
  isVisible?: boolean;
  type?: string | null;
}

export interface CreateColumnSchemaDto {
  entityName?: string;
  fieldName?: string;
  headerName?: string;
  width?: number | null;
  isSortable?: boolean;
  isVisible?: boolean;
  frozen?: string;
  align?: string;
  formatter?: string;
  displayOrder?: number;
}

export interface CreateFilterConfigSchemeDto {
  entityName?: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  filters?: string;
}

export interface CreateFormSchemaDto {
  entityName?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldType?: string;
  isRequired?: boolean;
  maxLength?: number | null;
  displayOrder?: number;
  colSpan?: number;
  isVisible?: boolean;
  isReadOnly?: boolean;
  options?: string;
}

export interface CreateLookupConfigSchemeDto {
  entityName?: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  lookupConfig?: string;
}

export interface CreateLookupSchemaDto {
  entityName?: string;
  propertyName?: string;
  targetEntity?: string;
  displayField?: string;
  valueField?: string;
  apiUrl?: string;
  isTree?: boolean;
  defaultFilters?: string;
}

export interface CreateTableConfigSchemeDto {
  entityName?: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  columns?: string;
}

export interface FilterConfigSchemeDto {
  id?: string;
  entityName?: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  filters?: string;
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface FormFieldConfigDto {
  key?: string;
  label?: string;
  type?: string;
  required?: boolean;
  colSpan?: number;
}

export interface FormSchemaDto {
  id?: string;
  entityName?: string | null;
  fieldName?: string | null;
  fieldLabel?: string | null;
  fieldType?: string | null;
  isRequired?: boolean;
  maxLength?: number | null;
  displayOrder?: number;
  colSpan?: number;
  isVisible?: boolean;
  isReadOnly?: boolean;
  options?: string | null;
}

export interface GeneratedSchemaDto {
  entityName?: string;
  formFields?: FormFieldConfigDto[];
  columns?: ColumnConfigDto[];
  lookups?: LookupConfigDto[];
  generatedAt?: string;
}

export interface LookupConfigDto {
  propertyName?: string;
  targetEntity?: string;
  displayField?: string;
  valueField?: string;
}

export interface LookupConfigSchemeDto {
  id?: string;
  entityName?: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  lookupConfig?: string;
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface LookupSchemaDto {
  id?: string;
  entityName?: string | null;
  propertyName?: string | null;
  targetEntity?: string | null;
  displayField?: string | null;
  valueField?: string | null;
  apiUrl?: string | null;
  isTree?: boolean;
}

export interface SaveSchemaInput {
  formSchemas?: CreateFormSchemaDto[];
  columnSchemas?: CreateColumnSchemaDto[];
  lookupSchemas?: CreateLookupSchemaDto[];
}

export interface ScanErrorDto {
  entity?: string;
  error?: string;
}

export interface ScanHistoryDto {
  id?: string;
  entityName?: string;
  scannedAt?: string;
  status?: string;
}

export interface ScanResultDto {
  scanned?: string[];
  created?: string[];
  updated?: string[];
  errors?: ScanErrorDto[];
}

export interface TableConfigSchemeDto {
  id?: string;
  entityName?: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  columns?: string;
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface UpdateColumnSchemaDto {
  entityName?: string;
  fieldName?: string;
  headerName?: string;
  width?: number | null;
  isSortable?: boolean;
  isVisible?: boolean;
  frozen?: string;
  align?: string;
  formatter?: string;
  displayOrder?: number;
}

export interface UpdateFilterConfigSchemeDto {
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  filters?: string;
}

export interface UpdateFormSchemaDto {
  entityName?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldType?: string;
  isRequired?: boolean;
  maxLength?: number | null;
  displayOrder?: number;
  colSpan?: number;
  isVisible?: boolean;
  isReadOnly?: boolean;
  options?: string;
}

export interface UpdateLookupConfigSchemeDto {
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  lookupConfig?: string;
}

export interface UpdateLookupSchemaDto {
  entityName?: string;
  propertyName?: string;
  targetEntity?: string;
  displayField?: string;
  valueField?: string;
  apiUrl?: string;
  isTree?: boolean;
  defaultFilters?: string;
}

export interface UpdateTableConfigSchemeDto {
  name?: string;
  description?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  columns?: string;
}
