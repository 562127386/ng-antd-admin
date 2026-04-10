import { Component, OnInit, TemplateRef, ViewChild, inject, CUSTOM_ELEMENTS_SCHEMA, DestroyRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { ModalOptions, NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SchemeService } from '../services/scheme.service';
import { FormSchemaDto, ColumnSchemaDto } from '../models/scheme.model';
import { HttpClientModule } from '@angular/common/http';
import { DynamicListComponent } from '../../../lib/components/dynamic-list/dynamic-list.component';
import { AdvancedFiltersComponent } from '../../../lib/components/advanced-filters/advanced-filters.component';
import { ModalBtnStatus, ModalWrapService } from '@app/widget/base-modal';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DynamicDetailFormComponent } from '@app/lib/components/dynamic-detail-form/dynamic-detail-form.component';
import { AbpDynamicDetailFormComponent } from '@app/lib/components/dynamic-detail-form/abp-dynamic-detail-form.component';
import { ConfigSchemeService } from '@app/lib/services';
import { NzDynamicFormComponent } from '@app/dynamic-form-ng-zorro/src/components/main-form/nz-dynamic-form.component';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' |'switch'|'boolean';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: any }[];
  maxLength?: number;
  isReadOnly?: boolean;
  isVisible?: boolean;
}

interface Defect {
  id: number;
  name: string;
  code: string;
  severity: string;
  description: string;
  [key: string]: any;
}

interface DynamicListColumn {
  key: string;
  title: string;
  width?: number;
  sortable?: boolean;
  visible?: boolean;
  align?: string;
  formatter?: (value: any, record: any) => string;
}

@Component({
  selector: 'app-dynamic-form-demo',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSpaceModule,
    NzModalModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzDynamicFormComponent,
    AbpDynamicDetailFormComponent,
    DynamicDetailFormComponent,
    DynamicListComponent,
    AdvancedFiltersComponent
  ],
  templateUrl: './dynamic-form-demo.component.html',
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicFormDemoComponent implements OnInit {
  fields: FormField[] = [];
  detailFields: any[] = [];
  columns: DynamicListColumn[] = [];
  abpColumns: any[] = [];
  defects: Defect[] = [];
  //form: FormGroup;
  isVisible = false;
  isEditMode = false;
  currentDefect: Defect | null = null;
  loading = false;
  entityName = 'Defect';
  filterItems: any[] = [];
  private schemeService = inject(SchemeService);
   private configSchemeService = inject(ConfigSchemeService);
  @ViewChild('dynamicList') dynamicList: any;
  constructor(private fb: FormBuilder, private message: NzMessageService) {
    //this.form = this.fb.group({});
  }
 private modalWrapService = inject(ModalWrapService);
 destroyRef = inject(DestroyRef);
  ngOnInit(): void {
    console.log('DynamicFormDemoComponent initialized');
    console.log('Entity name:', this.entityName);
    this.loadFormSchemas();
    this.loadColumnSchemas();
    //this.loadDefects();
  }

  loadFormSchemas(): void {
    try {
      this.loading = true;
      console.log('Loading form schemas for entity:', this.entityName);
      this.schemeService.getFormSchemas(this.entityName).subscribe({
        next: (schemas: FormSchemaDto[]) => {
          console.log('Form schemas received:', schemas);
          this.fields = schemas
            .filter(schema => schema.isVisible)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(schema => ({
              key: schema.fieldName,
              label: schema.fieldLabel,
              type: this.mapFieldType(schema.fieldType),
              required: schema.isRequired,
              placeholder: `请输入${schema.fieldLabel}`,
              options: schema.options ? JSON.parse(schema.options) : undefined,
              maxLength: schema.maxLength,
              isReadOnly: schema.isReadOnly,
              isVisible: schema.isVisible
            }));
          
          // 生成符合abp-dynamic-detail-form要求的字段配置
          this.detailFields = schemas
            .filter(schema => schema.isVisible)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(schema => ({
              key: schema.fieldName,
              label: schema.fieldLabel,
              type: this.mapFieldType(schema.fieldType),
              required: schema.isRequired,
              placeholder: `请输入${schema.fieldLabel}`,
              options: schema.options ? JSON.parse(schema.options) : undefined,
              maxLength: schema.maxLength,
              disabled: schema.isReadOnly,
              hidden: !schema.isVisible,
              order: schema.displayOrder,
              gridSize: schema.colSpan
            }));
          
          // 生成符合abp-advanced-filters要求的过滤字段配置
          this.filterItems = schemas
            .filter(schema => schema.isVisible)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(schema => ({
              field: schema.fieldName,
              label: schema.fieldLabel,
              type: this.mapFieldType(schema.fieldType),
              placeholder: `请输入${schema.fieldLabel}`,
              options: schema.options ? JSON.parse(schema.options) : undefined
            }));
          
          console.log('Generated filter items:', this.filterItems);
          //this.buildForm();
        },
        error: (error) => {
          console.error('Error loading form schemas:', error);
          this.message.error('加载表单配置失败');
          // 使用默认字段配置作为 fallback
          //this.useDefaultFields(); 以后可以写个空白列
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error loading form schemas:', error);
      this.message.error('加载表单配置失败');
      // 使用默认字段配置作为 fallback
      //this.useDefaultFields();以后可以写个空白列
      this.loading = false;
    }
  }

  loadColumnSchemas(): void {
    try {
      console.log('Loading column schemas for entity:', this.entityName);
      this.schemeService.getColumnSchemas(this.entityName).subscribe({
        next: (schemas: ColumnSchemaDto[]) => {
          console.log('Column schemas received:', schemas);
          this.columns = schemas
            .filter(schema => schema.isVisible)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(schema => ({
              key: schema.fieldName,
              title: schema.headerName,
              width: schema.width,
              sortable: schema.isSortable,
              visible: schema.isVisible,
              align: schema.align,
              formatter: schema.fieldName === 'gender' ? (value: any) => this.getGenderText(value) : undefined
            }));
          
          // 生成符合ColumnConfig接口的abpColumns
          this.abpColumns = schemas
            .filter(schema => schema.isVisible)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map(schema => ({
              field: schema.fieldName,
              headerName: schema.headerName,
              displayName: schema.headerName,
              width: schema.width,
              sortable: schema.isSortable,
              visible: schema.isVisible,
              frozen: schema.frozen as 'left' | 'right' | null,
              align: (schema.align as 'left' | 'center' | 'right') || 'left',
              order: schema.displayOrder,
              formatter: schema.fieldName.toLowerCase() === 'gender' ? (value: any) => this.getGenderText(value) : undefined
            }));
          
          console.log('Generated abp columns:', this.abpColumns);
        },
        error: (error) => {
          console.error('Error loading column schemas:', error);
          // 使用默认列配置作为 fallback
          //this.useDefaultColumns(); 以后可以写个空白列
        }
      });
    } catch (error) {
      console.error('Error loading column schemas:', error);
      // 使用默认列配置作为 fallback
      //this.useDefaultColumns();  以后可以写个空白列
    }
  }

  // async loadDefects(): Promise<void> {
  //   try {
  //     // 这里应该从后端API获取缺陷数据，暂时使用模拟数据
  //     this.defects = [
  //       { id: 1, name: '外观缺陷', code: 'AP001', severity: 'high', description: '产品表面有划痕' },
  //       { id: 2, name: '功能缺陷', code: 'FN001', severity: 'medium', description: '按钮无响应' },
  //       { id: 3, name: '性能缺陷', code: 'PM001', severity: 'low', description: '响应速度慢' }
  //     ];
  //     console.log('Generated defects data:', this.defects);
  //   } catch (error) {
  //     console.error('Error loading defects:', error);
  //     this.message.error('加载缺陷数据失败');
  //   }
  // }

  // buildForm(): void {
  //   const group: any = {};
  //   this.fields.forEach(field => {
  //     if (field.isVisible && !field.isReadOnly) {
  //       group[field.key] = [null, field.required ? Validators.required : null];
  //     }
  //   });
  //   this.form = this.fb.group(group);
  // }

  openModal(event?: any): void {
    // 从事件对象中提取缺陷数据
    let defect: Defect | null = null;
    if (event && (event as any).detail) {
      defect = (event as any).detail;
    } else if (event) {
      // 直接使用 event 作为缺陷数据
      defect = event;
    }
    
    this.isEditMode = !!defect;
    this.currentDefect = defect || null;
    
    // if (defect) {
    //   this.form.patchValue(defect);
    // } else {
    //   this.form.reset();
    // }
    // 确保 fields 不是空数组
    console.log('openModal - detailFields length:', this.detailFields.length);
    console.log('openModal - detailFields:', this.detailFields);
    // 确保 values 格式正确
    console.log('openModal - currentDefect:', this.currentDefect);
   // this.isVisible = true;
    console.log('openModal - isVisible set to:', this.isVisible);

    let modalOptions: ModalOptions = { nzTitle:this.isEditMode?'编辑':'新增'};
   // this.modalWrapService.show<DynamicDetailFormComponent,any>(DynamicDetailFormComponent, modalOptions,
    this.modalWrapService.show<NzDynamicFormComponent,any>(NzDynamicFormComponent, modalOptions,
      { fields: this.detailFields,values: this.currentDefect}).pipe(
        finalize(() => {
          //this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          this.currentDefect = null;
          return;
        }
        const param = { ...res.modalValue };
         this.submitForm(param);
        // this.tableLoading(true);
        // this.addEditData(param, 'addRoles');
    });


  }

  closeModal(): void {
    this.isVisible = false;
    this.currentDefect = null;
    //this.form.reset();
  }

  async submitForm(values: any): Promise<void> {
    try {
      this.loading = true;
      const formValue = values;
      
      if (this.isEditMode && this.currentDefect) {
        // 编辑缺陷 - 调用后端API
        const response = await fetch(`https://localhost:44312/api/defects/${this.currentDefect.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValue)
        });
        
        if (response.ok) {
          if(this.isEditMode)
          {
            this.message.success('编辑成功');
            // 刷新列表数据
            if (this.dynamicList) {
              this.dynamicList.refresh();
            }
          }
          // const index = this.defects.findIndex(d => d.id === this.currentDefect?.id);
          // if (index !== -1) {
          //   this.defects[index] = { ...this.currentDefect, ...formValue };
          //   this.message.success('编辑成功');
          //   // 刷新列表数据
          //   if (this.dynamicList) {
          //     this.dynamicList.refresh();
          //   }
          // }
        } else {
          throw new Error('Failed to update defect');
        }
      } else {
        // 新增缺陷 - 调用后端API
        const response = await fetch('https://localhost:44312/api/defects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValue)
        });
        
        if (response.ok) {
          // const newDefect: Defect = {
          //   id: this.defects.length + 1,
          //   ...formValue
          // };
          // this.defects.push(newDefect);
          this.message.success('新增成功');
          // 刷新列表数据
          if (this.dynamicList) {
            this.dynamicList.refresh();
          }
        } else {
          throw new Error('Failed to create defect');
        }
      }
      
      this.closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      this.message.error(this.isEditMode ? '编辑缺陷失败' : '新增缺陷失败');
    } finally {
      this.loading = false;
    }
  }

  async deleteDefect(event: Event | Defect): Promise<void> {
    try {
      // 从事件对象中提取缺陷数据
      let defect: Defect;
      if ((event as any).detail) {
        defect = (event as any).detail;
      } else {
        defect = event as Defect;
      }
      
      this.loading = true;
      // 调用后端API删除缺陷
      const response = await fetch(`https://localhost:44312/api/defects/${defect.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const index = this.defects.findIndex(d => d.id === defect.id);
        if (index !== -1) {
          this.defects.splice(index, 1);
          this.message.success('删除成功');
          // 刷新列表数据
          if (this.dynamicList) {
            this.dynamicList.refresh();
          }
        }
      } else {
        throw new Error('Failed to delete defect');
      }
    } catch (error) {
      console.error('Error deleting defect:', error);
      this.message.error('删除缺陷失败');
    } finally {
      this.loading = false;
    }
  }

  onFieldChange(event: any): void {
    // 处理字段变化事件
    console.log('Field changed:', event);
  }

  onLookupOpen(event: any): void {
    // 处理查找字段打开事件
    console.log('Lookup opened:', event);
  }

  getGenderText(gender: string): string {
    return gender === 'male' ? '男' : '女';
  }

  // getErrorTip(key: string): string {
  //   const control = this.form.get(key);
  //   if (!control || !control.errors) return '';

  //   if (control.errors['required']) {
  //     return '此字段不能为空';
  //   }

  //   return '';
  // }

  onFilterChange(filters: any[]): void {
    console.log('Filter changed:', filters);
    // 这里可以将过滤条件传递给abp-dynamic-list组件
    // 或者直接调用API获取过滤后的数据
  }

  onSchemeChange(event: { type: 'save' | 'load'; scheme?: any }): void {
    console.log('Scheme changed:', event);
    if (event.type === 'save') {
      // 保存查询方案
      console.log('Saving scheme:', event.scheme);
      // 拼接新属性 → 生成新对象
      const userScheme = {
        ...event.scheme, // 展开原有属性
        // name: string;
         entityName: this.entityName,
        //   isPublic: boolean;
          columns: JSON.stringify(this.dynamicList.columns),
          pageSize: this.dynamicList.pageSize,//这个后端目前没这列！！！！！！！！！！
          description: JSON.stringify(this.dynamicList.pageSizeOptions),
          isDefault: true
      };
      // 这里可以调用后端API保存查询方案
      this.configSchemeService.createTableScheme(userScheme).subscribe(
        (response) => {
          this.message.success('查询方案保存成功');
        },
        (error) => {
          console.error('Error saving scheme:', error);
          this.message.error('查询方案保存失败');
        }
      );
    } else if (event.type === 'load') {
      // 加载查询方案
      console.log('Loading scheme:', event.scheme);
      // 这里可以调用后端API加载查询方案
    }
  }

  private mapFieldType(fieldType: string): 'text' | 'number' | 'select' | 'date' |'switch'|'boolean'{
    switch (fieldType.toLowerCase()) {
      case 'string':
        return 'text';
      case 'int':
      case 'long':
      case 'decimal':
      case 'double':
        return 'number';
      case 'select':
        return 'select';
      case 'date':
      case 'datetime':
        return 'date';
      case 'boolean':
      case 'switch':
        return 'switch';  
      default:
        return 'text';
    }
  }

  // private useDefaultFields(): void {
  //   this.fields = [
  //     {
  //       key: 'name',
  //       label: '姓名',
  //       type: 'text',
  //       required: true,
  //       placeholder: '请输入姓名'
  //     },
  //     {
  //       key: 'age',
  //       label: '年龄',
  //       type: 'number',
  //       required: true,
  //       placeholder: '请输入年龄'
  //     },
  //     {
  //       key: 'gender',
  //       label: '性别',
  //       type: 'select',
  //       required: true,
  //       options: [
  //         { label: '男', value: 'male' },
  //         { label: '女', value: 'female' }
  //       ]
  //     },
  //     {
  //       key: 'birthday',
  //       label: '生日',
  //       type: 'date',
  //       required: true
  //     }
  //   ];
    
  //   // // 生成符合abp-dynamic-detail-form要求的默认字段配置
  //   // this.detailFields = [
  //   //   {
  //   //     key: 'name',
  //   //     label: '姓名',
  //   //     type: 'text',
  //   //     required: true,
  //   //     placeholder: '请输入姓名',
  //   //     disabled: false,
  //   //     hidden: false,
  //   //     order: 1,
  //   //     colSpan: 1
  //   //   },
  //   //   {
  //   //     key: 'age',
  //   //     label: '年龄',
  //   //     type: 'number',
  //   //     required: true,
  //   //     placeholder: '请输入年龄',
  //   //     disabled: false,
  //   //     hidden: false,
  //   //     order: 2,
  //   //     colSpan: 1
  //   //   },
  //   //   {
  //   //     key: 'gender',
  //   //     label: '性别',
  //   //     type: 'select',
  //   //     required: true,
  //   //     options: [
  //   //       { label: '男', value: 'male' },
  //   //       { label: '女', value: 'female' }
  //   //     ],
  //   //     disabled: false,
  //   //     hidden: false,
  //   //     order: 3,
  //   //     colSpan: 1
  //   //   },
  //   //   {
  //   //     key: 'birthday',
  //   //     label: '生日',
  //   //     type: 'date',
  //   //     required: true,
  //   //     disabled: false,
  //   //     hidden: false,
  //   //     order: 4,
  //   //     colSpan: 1
  //   //   }
  //   // ];
    
  //   // // 生成符合abp-advanced-filters要求的默认过滤字段配置
  //   // this.filterItems = [
  //   //   {
  //   //     field: 'name',
  //   //     label: '姓名',
  //   //     type: 'text',
  //   //     placeholder: '请输入姓名'
  //   //   },
  //   //   {
  //   //     field: 'age',
  //   //     label: '年龄',
  //   //     type: 'number',
  //   //     placeholder: '请输入年龄'
  //   //   },
  //   //   {
  //   //     field: 'gender',
  //   //     label: '性别',
  //   //     type: 'select',
  //   //     options: [
  //   //       { label: '男', value: 'male' },
  //   //       { label: '女', value: 'female' }
  //   //     ]
  //   //   },
  //   //   {
  //   //     field: 'birthday',
  //   //     label: '生日',
  //   //     type: 'date'
  //   //   }
  //   // ];
    
  //   this.buildForm();
  // }

  // private useDefaultColumns(): void {
  //   this.columns = [
  //     {
  //       key: 'name',
  //       title: '姓名',
  //       width: 120,
  //       sortable: true,
  //       visible: true,
  //       align: 'left'
  //     },
  //     {
  //       key: 'age',
  //       title: '年龄',
  //       width: 80,
  //       sortable: true,
  //       visible: true,
  //       align: 'center'
  //     },
  //     {
  //       key: 'gender',
  //       title: '性别',
  //       width: 80,
  //       sortable: true,
  //       visible: true,
  //       align: 'center',
  //       formatter: (value: any) => this.getGenderText(value)
  //     },
  //     {
  //       key: 'birthday',
  //       title: '生日',
  //       width: 150,
  //       sortable: true,
  //       visible: true,
  //       align: 'center'
  //     }
  //   ];
    
    // 生成符合ColumnConfig接口的默认abpColumns
    // this.abpColumns = [
    //   {
    //     field: 'name',
    //     headerName: '姓名',
    //     displayName: '姓名',
    //     width: 120,
    //     sortable: true,
    //     visible: true,
    //     frozen: null,
    //     align: 'left',
    //     order: 1
    //   },
    //   {
    //     field: 'age',
    //     headerName: '年龄',
    //     displayName: '年龄',
    //     width: 80,
    //     sortable: true,
    //     visible: true,
    //     frozen: null,
    //     align: 'center',
    //     order: 2
    //   },
    //   {
    //     field: 'gender',
    //     headerName: '性别',
    //     displayName: '性别',
    //     width: 80,
    //     sortable: true,
    //     visible: true,
    //     frozen: null,
    //     align: 'center',
    //     order: 3,
    //     formatter: (value: any) => this.getGenderText(value)
    //   },
    //   {
    //     field: 'birthday',
    //     headerName: '生日',
    //     displayName: '生日',
    //     width: 150,
    //     sortable: true,
    //     visible: true,
    //     frozen: null,
    //     align: 'center',
    //     order: 4
    //   }
    // ];
  //}
}