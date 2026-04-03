export interface FormSchemaDto {
  id: string;
  entityName: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  isRequired: boolean;
  maxLength?: number;
  displayOrder: number;
  colSpan: number;
  isVisible: boolean;
  isReadOnly: boolean;
  options: string;
}

export interface ColumnSchemaDto {
  id: string;
  entityName: string;
  fieldName: string;
  headerName: string;
  width?: number;
  isSortable: boolean;
  isVisible: boolean;
  frozen: string;
  align: string;
  formatter: string;
  displayOrder: number;
}

export interface LookupSchemaDto {
  id: string;
  entityName: string;
  propertyName: string;
  targetEntity: string;
  displayField: string;
  valueField: string;
  apiUrl: string;
  isTree: boolean;
  defaultFilters: string;
}
