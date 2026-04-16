import {Component, DestroyRef, inject, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Alert, Drill, DrillInput, EruptModel, Power, Row, RowOperation, Sort, Vis, VisType} from "../../model/erupt.model";
import {EditComponent} from "../edit/edit.component";
import {EruptBuildModel} from "../../model/erupt-build.model";
import {cloneDeep} from "lodash";
import {
    FormSize,
    OperationIfExprBehavior,
    OperationMode,
    OperationType,
    PagingType,
    RestPath,
    Scene,
    SelectMode,
    SortType,
    ViewType
} from "../../model/erupt.enum";
import {DataHandlerService} from "../../service/data-handler.service";
import {Status} from "../../model/erupt-api.model";
import {EruptFieldModel, View} from "../../model/erupt-field.model";
import {Observable} from "rxjs";
import {UiBuildService} from "../../service/ui-build.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {ModalButtonOptions, ModalOptions, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {STChange, STChangeSort, STColumn, STColumnButton, STComponent, STData, STPage} from "@delon/abc/st";
import {CodeEditorComponent} from "../../components/code-editor/code-editor.component";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {QueryCondition, TableStyle} from "../../model/erupt.vo";
import { AppViewService } from "@app/shared/zero-code/app-view.service";
import { DataService, PagedRequest } from "@app/shared/zero-code/data.service";
import { CoreModule, EnvironmentService, ListService, LocalizationService, PagedResultDto } from "@abp/ng.core";
import { WindowModel } from "@app/shared/zero-code/model/window.model";
import { FormsModule } from "@angular/forms";
import { finalize, map } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { SchemeService } from "@app/pages/base-data/services/scheme.service";
import { ColumnSchemaDto, FormSchemaDto } from "@app/pages/base-data/models/scheme.model";
import { NzDynamicFormComponent } from "@app/dynamic-form-ng-zorro/src";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ModalBtnStatus, ModalWrapService } from "@app/widget/base-modal";
import { EruptIframeComponent } from "@app/shared/zero-code/component/iframe.component";
import { SettingsService } from "@delon/theme";
import { ExcelImportComponent } from "@app/erupt/components/excel-import/excel-import.component";
import { HttpHeaders } from "@angular/common/http";
import saveAs from "file-saver";

@Component({
    standalone: false,
    selector: "erupt-table",
    providers: [ListService],
    templateUrl: "./table.component.html",
    styleUrls: ["./table.component.less"]
})
export class TableComponent implements OnInit, OnDestroy {

    @Input() set entityName(value: string) {
                    this.eruptBuildModel = {
  "eruptModel": {
    "eruptName": value,
    eruptJson: {
        vis: [],
        //   "param": {
        //     "Hello": {
        //       "value": "World",
        //       "desc": ""
        //     }
        //   },
        //   extra: {
        //     "Table": {
        //       "schema": "",
        //       "name": "demo_student",
        //       "catalog": "",
        //       "indexes": [],
        //       "uniqueConstraints": []
        //     }
        //   },
        "desc": "管理学生基础数据",
        "tree": {
            "id": "id",
            "pid": "",
            level: 0,
            linkTable: [],
            "label": "name",
            "expandLevel": 999
        },
        "layout": {
            formSize: FormSize.FULL_LINE,
            pagingType: PagingType.BACKEND,
            "pageSize": 10,
            "refreshTime": -1,
            //"formSize": "FULL_LINE",
            "tableLeftFixed": 0,
            "tableRightFixed": 0,
            //"pagingType": "BACKEND",
            "pageSizes": [10, 20, 30, 50, 100, 300, 500],
            "tableWidth": "",
            "tableOperatorWidth": ""
        },
        "primaryKeyCol": "id",
        "rowOperation": [],
        "drills": [],
        //"dataProxyParams": [],
        "visRawTable": true,
        power: {"add": true,
                "edit": true,
                "delete": true,
                "query": true,
                "viewDetails": true,
                "export": true,
                "importable": true
            },
        linkTree: { field: "",
            dependNode: false,
            value: []}
            },

    eruptFieldModels:[], extraRow:false, searchCondition:undefined,

//     "eruptFieldModels": [
//       {
//         "fieldName": "name",
//         "eruptFieldJson": {
//           "views": [
//             {
//               "viewType": "TEXT",
//               "className": "",
//               "desc": "",
//               "width": "",
//               "column": "",
//               "title": "姓名",
//               "show": true,
//               "tpl": {
//                 "path": "",
//                 "width": "",
//                 "enable": false,
//                 "embedType": "IFRAME",
//                 "height": "",
//                 "openWay": "MODAL",
//                 "drawerPlacement": "RIGHT"
//               },
//               "sortable": false,
//               "template": ""
//             }
//           ],
//           "edit": {
//             "inputType": {
//               "type": "text",
//               "length": 255,
//               "prefix": [],
//               "suffix": [],
//               "fullSpan": false
//             },
//             "type": "INPUT",
//             "desc": "",
//             "search": {
//               "value": false,
//               "notNull": false,
//               "vague": false
//             },
//             "notNull": true,
//             "onchange": "OnChange",
//             "title": "姓名",
//             "show": true,
//             "readOnly": {
//               "add": false,
//               "edit": false,
//               "allowChange": true
//             },
//             "placeHolder": ""
//           }
//         },
//         "value": null,
//         "componentValue": null
//       },
//       {
//         "fieldName": "sex",
//         "eruptFieldJson": {
//           "views": [
//             {
//               "viewType": "BOOLEAN",
//               "className": "",
//               "desc": "",
//               "width": "",
//               "column": "",
//               "title": "性别",
//               "show": true,
//               "tpl": {
//                 "path": "",
//                 "width": "",
//                 "enable": false,
//                 "embedType": "IFRAME",
//                 "height": "",
//                 "openWay": "MODAL",
//                 "drawerPlacement": "RIGHT"
//               },
//               "sortable": false,
//               "template": ""
//             }
//           ],
//           "edit": {
//             "type": "BOOLEAN",
//             "desc": "",
//             "search": {
//               "value": false,
//               "notNull": false,
//               "vague": false
//             },
//             "notNull": false,
//             "onchange": "OnChange",
//             "title": "性别",
//             "show": true,
//             "boolType": {
//               "trueText": "男",
//               "falseText": "女"
//             },
//             "readOnly": {
//               "add": false,
//               "edit": false,
//               "allowChange": true
//             },
//             "placeHolder": ""
//           }
//         },
//         "value": null,
//         "componentValue": null
//       },
//       {
//         "fieldName": "birthday",
//         "eruptFieldJson": {
//           "views": [
//             {
//               "viewType": "DATE",
//               "className": "",
//               "desc": "",
//               "width": "",
//               "column": "",
//               "title": "出生日期",
//               "show": true,
//               "tpl": {
//                 "path": "",
//                 "width": "",
//                 "enable": false,
//                 "embedType": "IFRAME",
//                 "height": "",
//                 "openWay": "MODAL",
//                 "drawerPlacement": "RIGHT"
//               },
//               "sortable": false,
//               "template": ""
//             }
//           ],
//           "edit": {
//             "type": "DATE",
//             "desc": "",
//             "search": {
//               "value": false,
//               "notNull": false,
//               "vague": false
//             },
//             "notNull": false,
//             "onchange": "OnChange",
//             "title": "出生日期",
//             "show": true,
//             "readOnly": {
//               "add": false,
//               "edit": false,
//               "allowChange": true
//             },
//             "dateType": {
//               "type": "DATE",
//               "pickerMode": "HISTORY"
//             },
//             "placeHolder": ""
//           }
//         },
//         "value": null,
//         "componentValue": null
//       },
//       {
//         "fieldName": "grade",
//         "eruptFieldJson": {
//           "views": [
//             {
//               "viewType": "TEXT",
//               "className": "",
//               "desc": "",
//               "width": "",
//               "column": "",
//               "title": "年级（高中）",
//               "show": true,
//               "tpl": {
//                 "path": "",
//                 "width": "",
//                 "enable": false,
//                 "embedType": "IFRAME",
//                 "height": "",
//                 "openWay": "MODAL",
//                 "drawerPlacement": "RIGHT"
//               },
//               "sortable": false,
//               "template": ""
//             }
//           ],
//           "edit": {
//             "type": "CHOICE",
//             "desc": "",
//             "search": {
//               "value": true,
//               "notNull": false,
//               "vague": false
//             },
//             "notNull": false,
//             "onchange": "Student",
//             "title": "年级（高中）",
//             "show": true,
//             "choiceType": {
//               "type": "RADIO",
//               "dependField": "",
//               "anewFetch": false
//             },
//             "readOnly": {
//               "add": false,
//               "edit": false,
//               "allowChange": true
//             },
//             "placeHolder": ""
//           }
//         },
//         "value": null,
//         "componentValue": [
//           {
//             "value": "1",
//             "label": "一年级",
//             "desc": "",
//             "color": "",
//             "disable": false,
//             "extra": null
//           },
//           {
//             "value": "2",
//             "label": "二年级",
//             "desc": "",
//             "color": "",
//             "disable": false,
//             "extra": null
//           },
//           {
//             "value": "3",
//             "label": "三年级",
//             "desc": "",
//             "color": "",
//             "disable": false,
//             "extra": null
//           }
//         ]
//       },
//       {
//         "fieldName": "createBy",
//         "eruptFieldJson": {
//           "views": [
//             {
//               "viewType": "TEXT",
//               "className": "",
//               "desc": "",
//               "width": "100px",
//               "column": "",
//               "title": "创建人",
//               "show": true,
//               "tpl": {
//                 "path": "",
//                 "width": "",
//                 "enable": false,
//                 "embedType": "IFRAME",
//                 "height": "",
//                 "openWay": "MODAL",
//                 "drawerPlacement": "RIGHT"
//               },
//               "sortable": false,
//               "template": ""
//             }
//           ],
//           "edit": {
//             "inputType": {
//               "type": "text",
//               "length": 255,
//               "prefix": [],
//               "suffix": [],
//               "fullSpan": false
//             },
//             "type": "INPUT",
//             "desc": "",
//             "search": {
//               "value": false,
//               "notNull": false,
//               "vague": false
//             },
//             "notNull": false,
//             "onchange": "OnChange",
//             "title": "创建人",
//             "show": true,
//             "readOnly": {
//               "add": true,
//               "edit": true,
//               "allowChange": false
//             },
//             "placeHolder": ""
//           }
//         },
//         "value": null,
//         "componentValue": null
//       },
//       {
//         "fieldName": "createTime",
//         "eruptFieldJson": {
//           "views": [
//             {
//               "viewType": "DATE_TIME",
//               "className": "",
//               "desc": "",
//               "width": "",
//               "column": "",
//               "title": "创建时间",
//               "show": true,
//               "tpl": {
//                 "path": "",
//                 "width": "",
//                 "enable": false,
//                 "embedType": "IFRAME",
//                 "height": "",
//                 "openWay": "MODAL",
//                 "drawerPlacement": "RIGHT"
//               },
//               "sortable": true,
//               "template": ""
//             }
//           ],
//           "edit": {
//             "type": "DATE",
//             "desc": "",
//             "search": {
//               "value": false,
//               "notNull": false,
//               "vague": false
//             },
//             "notNull": false,
//             "onchange": "OnChange",
//             "title": "创建时间",
//             "show": true,
//             "readOnly": {
//               "add": true,
//               "edit": true,
//               "allowChange": false
//             },
//             "dateType": {
//               "type": "DATE_TIME",
//               "pickerMode": "ALL"
//             },
//             "placeHolder": ""
//           }
//         },
//         "value": null,
//         "componentValue": null
//       },
//       {
//         "fieldName": "id",
//         "eruptFieldJson": {
//           "views": [],
//           "edit": {
//             "numberType": {
//               "min": -2147483647,
//               "max": 2147483647
//             },
//             "type": "NUMBER",
//             "desc": "",
//             "search": {
//               "value": false,
//               "notNull": false,
//               "vague": false
//             },
//             "notNull": false,
//             "onchange": "OnChange",
//             "title": "",
//             "show": true,
//             "readOnly": {
//               "add": false,
//               "edit": false,
//               "allowChange": true
//             },
//             "placeHolder": ""
//           }
//         },
//         "value": null,
//         "componentValue": null
//       }
//     ],
//     "searchCondition": {},
//     "extraRow": false,
//     "tags": {
//       "EruptFlow": {
//         "flowProxy": [
//           "TestFlowProxy"
//         ]
//       }
//     }
   },
  "tabErupts": undefined,
  "combineErupts": undefined,
  "operationErupts": undefined,
  "power": {
    "add": true,
    "edit": true,
    "delete": true,
    "query": true,
    "viewDetails": true,
    "export": true,
    "importable": true,
    //"print": true
  }
};


        this._entityName = value;
        this.loadColumnSchemas();
   
        
    }
    private schemeService = inject(SchemeService);
    loading = false;
    detailFields: any[] = [];
    loadColumnSchemas(): void {
        try {
        console.log('Loading column schemas for entity:', this.entityName);
        this.schemeService.getColumnSchemas(this.entityName.replaceAll('-','')).subscribe({
            next: (schemas: ColumnSchemaDto[]) => {
            console.log('Column schemas received:', schemas);
            // 生成符合ColumnConfig接口的abpColumns
            this.columns = schemas
                .filter(schema => schema.isVisible)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map(schema => {
                    // 基础列配置
                    const column: any = {
                    type :schema.type,
                    title: schema.headerName,       // STColumn 用 title 不是 headerName
                    index: schema.fieldName,        // ST 用 index 绑定字段，不是 field
                    width: schema.width || 100,
                    sort: schema.isSortable?true:undefined,        // ST 用 sort 不是 sortable
                    fixed: schema.frozen as 'left' | 'right' | undefined, // ST 用 fixed
                    align: (schema.align as 'left' | 'center' | 'right') || 'left',
                    };

                    // 性别格式化（你原来的逻辑保留）
                    if (schema.fieldName.toLowerCase() === 'gender') {
                    column.format = (value: any) => this.getGenderText(value);
                    }

                    return column;
                });



            this.buildTableConfig();
            console.log('Generated abp columns:', this.columns);
                this.list.get();

                this.loadFormSchemas();//先临时放这  后期要优化成一个请求
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
    loadFormSchemas(): void {
        try {
          this.loading = true;
          console.log('Loading form schemas for entity:', this.entityName);
          this.schemeService.getFormSchemas(this.entityName.replaceAll('-','')).subscribe({
            next: (schemas: FormSchemaDto[]) => {
              console.log('Form schemas received:', schemas);
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
              
            //   // 生成符合abp-advanced-filters要求的过滤字段配置
            //   this.filterItems = schemas
            //     .filter(schema => schema.isVisible)
            //     .sort((a, b) => a.displayOrder - b.displayOrder)
            //     .map(schema => ({
            //       field: schema.fieldName,
            //       label: schema.fieldLabel,
            //       type: this.mapFieldType(schema.fieldType),
            //       placeholder: `请输入${schema.fieldLabel}`,
            //       options: schema.options ? JSON.parse(schema.options) : undefined
            //     }));
              
            //   console.log('Generated filter items:', this.filterItems); 
            },
            error: (error) => {
              console.error('Error loading form schemas:', error);
              this.msg.error('加载表单配置失败');
              // 使用默认字段配置作为 fallback
              //this.useDefaultFields(); 以后可以写个空白列
            },
            complete: () => {
              this.loading = false;
            }
          });
        } catch (error) {
          console.error('Error loading form schemas:', error);
          this.msg.error('加载表单配置失败');
          // 使用默认字段配置作为 fallback
          //this.useDefaultFields();以后可以写个空白列
          this.loading = false;
        }
    }
  private mapFieldType(fieldType: string): 'text' | 'number' | 'select' | 'date' |'switch'|'boolean'|string{
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
        return fieldType;
    }
  }
    getGenderText(gender: string): string {
        return gender === 'male' ? '男' : '女';
    }
    get entityName(): string {
        return this._entityName;
    }

    private _entityName: string = '';

    items$!: Observable<PagedResultDto<any>>;

    pageTitle: string = '';

    columns: STColumn[] = [];

    searchValue: string = '';

    private sortItems: Array<{ key: string; order: 'ASC' | 'DESC' }> = [];

    ngOnInit(): void {
        this.pageTitle = `${this.entityName || '数据'}管理`;
        //this.columns = this.getDefaultColumns();

        this.items$ = this.list.hookToQuery((query) => {
            const sorting = this.sortItems.map(s => `${s.key} ${s.order}`).join(', ');
            const request = { ...query, sorting: sorting || undefined };
            return this.dataService.getAll(this.entityName, request);
        });
    }

    onStChange(ev: STChange | Event): void {
        if (!ev || ev instanceof Event) {
            return;
        }
        const change = ev as STChange;
        if (change.type === 'pi' ) {
            this.list.page = (change.pi ?? 1) -1 ;
             // 只需要赋值，不要调用 this.list.get();ListService 会自动触发请求
            return;
        }
        if (change.type === 'ps') {
            this.list.maxResultCount = change.ps ?? 10;
            // 只需要赋值，不要调用 this.list.get();ListService 会自动触发请求
            return;
        }
        if (change.type === 'sort' && change.sort) {
            this.handleSort(change.sort);
            this.list.page = 1;
            //this.list.get();
        }
    }
 

    private handleSort(sort: any): void {
        if (Array.isArray(sort)) {
            this.sortItems = sort
                .filter((s: any) => s?.key && s?.value)
                .map((s: any) => ({
                    key: s.key,
                    order: s.value === 'ascend' ? 'ASC' : 'DESC',
                }));
        } else {
            if (!sort?.key || !sort?.value) return;
            this.sortItems = [{
                key: sort.key,
                order: sort.value === 'ascend' ? 'ASC' : 'DESC',
            }];
        }
    }

    toFirstPageAndSearch(): void {
        this.list.page = 1;
        this.list.get();
    }

    currentEntity:any=null;
    modalWrapService = inject(ModalWrapService);
    dataHandler= inject(DataHandlerService);
    destroyRef = inject(DestroyRef);
    openCreateOrEdit(event?: any, fullLine = false, buttons: ModalButtonOptions[] = []) {
        

        console.log('打开新增:', this.entityName);
         // 从事件对象中提取实体数据
        let tmp: any = null;
        if (this.isGuid(event)) {
            // 调用后端获取实体数据
            this.dataService.get(this.entityName,event).subscribe(data => {
                this.currentEntity = data;
                let modalOptions: ModalOptions = { nzTitle:this.currentEntity==null?'编辑':'新增'};
                    this.modalWrapService.show<NzDynamicFormComponent,any>(NzDynamicFormComponent, modalOptions,
                    { fields: this.detailFields,values: this.currentEntity}).pipe(
                        finalize(() => {
                        //this.tableLoading(false);
                        }),
                        takeUntilDestroyed(this.destroyRef)
                    )
                    .subscribe(res => {
                        if (!res || res.status === ModalBtnStatus.Cancel) {
                            this.currentEntity = null;
                            return;
                        }
                        const param = { ...res.modalValue };
                        this.submitForm(param);
                });
            });
            
        }else{
            if (event && (event as any).detail) {
            tmp = (event as any).detail;
            } else { 
                // 直接使用 event 作为实体数据
                tmp = event; 
            }
            this.currentEntity = tmp || null;
            let modalOptions: ModalOptions = { nzTitle:this.currentEntity==null?'编辑':'新增'};
            this.modalWrapService.show<NzDynamicFormComponent,any>(NzDynamicFormComponent, modalOptions,
            { fields: this.detailFields,values: this.currentEntity}).pipe(
                finalize(() => {
                //this.tableLoading(false);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(res => {
                if (!res || res.status === ModalBtnStatus.Cancel) {
                this.currentEntity = null;
                return;
                }
                const param = { ...res.modalValue };
                this.submitForm(param);
            });
        }
         
       

    }
    /**
     * 判断一个值是否为有效的 GUID / UUID
     * @param value 任意类型的值 (any)
     * @returns 是 GUID 返回 true，否则 false
     */
    isGuid(value: any): boolean {
        // 1. 先判断是否为字符串，不是直接返回 false
        if (typeof value !== 'string' || !value) {
            return false;
        }

        // 2. GUID 正则表达式（兼容 UUID v4）
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        // 3. 匹配并返回结果
        return guidRegex.test(value.trim());
    }
    //erupt 的弹窗编辑实现
    onEdit(pk: any, fullLine = false, buttons: ModalButtonOptions[] = []) {
        let params = {
            eruptBuildModel: this.eruptBuildModel,
            id: pk,
            behavior: Scene.EDIT
        }
        const model = this.modal.create({
            nzDraggable: true,
            nzWrapClassName: fullLine ? undefined : "modal-lg edit-modal-lg",
            nzWidth: fullLine ? 550 : undefined,
            nzStyle: {top: "60px"},
            nzMaskClosable: false,
            nzKeyboard: false,
            nzTitle: this.l.instant("global.editor"),
            nzOkText: this.l.instant("global.update"),
            nzContent: EditComponent,
            nzFooter: [
                {
                    label: this.l.instant("global.cancel"),
                    onClick: () => {
                        model.close();
                    }
                },
                ...buttons,
                {
                    label: this.l.instant("global.update"),
                    type: "primary",
                    onClick: () => {
                        return model.triggerOk();
                    }
                },
            ],
            nzOnOk: async () => {
                let validateResult = model.getContentComponent().beforeSaveValidate();
                if (validateResult) {
                    let obj = this.dataHandler.eruptValueToObject(this.eruptBuildModel);
                    let res = await this.dataService.updateEntity(this.eruptBuildModel.eruptModel.eruptName, obj).toPromise().then(res => res);
                    if (res.status === Status.SUCCESS) {
                        this.msg.success(this.l.instant("global.update.success"));
                        this.list.get();
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        });
        Object.assign(model.getContentComponent(), params)
    }


    async submitForm(formValue: any): Promise<void> {
            try {
            this.loading = true;
            if (this.currentEntity) {//this.isEditMode && 
                // 编辑 - 调用后端API
                this.dataService.update(this.entityName,this.currentEntity.id,formValue).subscribe({
                    // ======================
                    // 成功（HTTP 200）
                    // ======================
                    next: (res) => {
                    console.log('调用成功', res);
                    this.msg.success('更新成功！');
                    // 刷新列表/关闭弹窗
                     this.list.get();
                    },

                    // ======================
                    // 失败（400/500/401/403/网络错误）
                    // ======================
                    error: (err) => {
                    console.error('调用失败', err);
                    this.msg.error('更新失败：' + (err.message || '未知错误'));
                    },
                    // ======================
                    // 完成（无论成功失败都会走）
                    // ======================
                    complete: () => {
                    console.log('请求结束');
                    }
                });
                 
            } else {
                // 新增缺陷 - 调用后端API
                this.dataService.create(this.entityName,formValue).subscribe({
                    // ======================
                    // 成功（HTTP 200）
                    // ======================
                    next: (res) => {
                    console.log('调用成功', res);
                    this.msg.success('更新成功！');
                    // 刷新列表/关闭弹窗
                     this.list.get();
                    },

                    // ======================
                    // 失败（400/500/401/403/网络错误）
                    // ======================
                    error: (err) => {
                    console.error('调用失败', err);
                    this.msg.error('更新失败：' + (err.message || '未知错误'));
                    },
                    // ======================
                    // 完成（无论成功失败都会走）
                    // ======================
                    complete: () => {
                    console.log('请求结束');
                    }
                });
            } 
            } catch (error) {
            console.error('Error submitting form:', error);
            this.msg.error('更新失败');
            } finally {
            this.loading = false;
            }
        }


    openEdit(id: string | number): void {
        console.log('打开编辑:', id);
    }

    delete(id: string | number): void {
        this.dataService.delete(this.entityName, id).subscribe(() => {
            this.list.get();
        });
    }

    private getDefaultColumns(): STColumn[] {
        return [
            { title: 'ID', index: 'id',  width: 80, sort: true },
            { title: '名称', index: 'name', sort: true },
            { title: '创建时间', index: 'creationTime', type: 'date', sort: true },
            { title: '创建人', index: 'creatorId' },
            { title: '描述', index: 'describe' },
            {
                title: '操作',
                width: 180,
                buttons: [
                    { text: '编辑', click: (item: any) => this.openEdit(item.id) },
                    { text: '删除', type: 'del', click: (item: any) => this.delete(item.id) },
                ],
            },
        ];
    }

    l = inject(LocalizationService);// 多语言
    //settingSrv=inject(SettingsService);
    buildTableConfig() {
        const _columns: STColumn[] = [];
        if (this._reference) {
            _columns.push({
                title: "", type: this._reference.mode, fixed: "left", width: "50px", className: "text-center",
                index: "id",//this.eruptBuildModel.eruptModel.eruptJson.primaryKeyCol
            });
        } else {
            _columns.push({
                title: "",
                width: "40px",
                resizable: false,
                type: "checkbox",
                fixed: "left",
                className: "text-center left-sticky-checkbox",
                index: "id",//this.eruptBuildModel.eruptModel.eruptJson.primaryKeyCol
            });
        }
        let viewCols = this.uiBuildService.viewToAlainTableConfig(this.eruptBuildModel, true);
        // for (let viewCol of viewCols) {
        //     viewCol.iif = () => {
        //         return viewCol['show'];
        //     };
        // }
        _columns.push(...viewCols);
        const tableOperators: STColumnButton[] = [];
        if (this.eruptBuildModel.eruptModel.eruptJson.power.viewDetails) {
            let fullLine = false;
            let layout = this.eruptBuildModel.eruptModel.eruptJson.layout;
            if (layout && layout.formSize == FormSize.FULL_LINE) {
                fullLine = true;
            }
            tableOperators.push({
                icon: "eye",
                tooltip: this.l.instant("global.view"),
                click: (record: any, modal: any) => {
                    let params = {
                        readonly: true,
                        eruptBuildModel: this.eruptBuildModel,
                        behavior: Scene.EDIT,
                        id: record[this.eruptBuildModel.eruptModel.eruptJson.primaryKeyCol]
                    };
                    //先不读取配置 注释 后期完善20260411
                    //if (this.settingSrv.layout['drawDraw']) {
                        //抽屉方式打开详情
                        this.drawerService.create({
                            nzTitle: this.l.instant("global.view"),
                            nzWidth: "75%",
                            nzContent: EditComponent,
                            nzContentParams: params
                        });
                    // } else {
                    //     let ref = this.modal.create({
                    //         nzDraggable: true,
                    //         nzWrapClassName: fullLine ? undefined : "modal-lg edit-modal-lg",
                    //         nzWidth: fullLine ? 550 : undefined,
                    //         nzStyle: {top: "60px"},
                    //         nzMaskClosable: true,
                    //         nzKeyboard: true,
                    //         nzCancelText: this.l.instant("global.close") + "（ESC）",
                    //         nzOkText: null,
                    //         nzTitle: this.l.instant("global.view"),
                    //         nzContent: EditComponent
                    //     });
                    //     Object.assign(ref.getContentComponent(), params)
                    // }
                },
                iif: (item) => {
                    if (item[TableStyle.power]) {
                        return (<Power>item[TableStyle.power]).viewDetails !== false
                    }
                    return true;
                }
            });
        }
        let tableButtons: STColumnButton[] = []
        let editButtons: ModalButtonOptions[] = [];
        const that = this;
        let exprEval = (expr:any, item:any) => {
            try {
                if (expr) {
                    return new Function("item", "return " + expr)(item);
                } else {
                    return true;
                }
            } catch (e) {
                // this.msg.error(e);
                return false;
            }
        }
        let isFoldButtons = false;
        for (let i in this.eruptBuildModel.eruptModel.eruptJson.rowOperation) {
            let ro = this.eruptBuildModel.eruptModel.eruptJson.rowOperation[i];
            if (ro.mode !== OperationMode.BUTTON && ro.mode !== OperationMode.MULTI_ONLY) {
                if (ro.fold) {
                    isFoldButtons = true;
                } else {
                    let text = "";
                    if (ro.icon) {
                        text = `<i class=\"${ro.icon}\"></i>`;
                    } else {
                        text = ro.title;
                    }
                    tableButtons.push({
                        type: 'link',
                        text: text,
                        tooltip: ro.title + (ro.tip && "(" + ro.tip + ")"),
                        click: (record: any, modal: any) => {
                            that.createOperator(ro, record);
                        },
                        iifBehavior: ro.ifExprBehavior == OperationIfExprBehavior.DISABLE ? "disabled" : "hide",
                        iif: (item) => {
                            return exprEval(ro.ifExpr, item);
                        }
                    });
                }
            }
        }

        //drill
        const eruptJson = this.eruptBuildModel.eruptModel.eruptJson;

        let createDrillModel = (drill: Drill, id: any) => {
            let ref = this.modal.create({
                nzDraggable: true,
                nzWrapClassName: "modal-xxl",
                nzStyle: {top: "30px"},
                nzBodyStyle: {padding: "18px"},
                nzMaskClosable: false,
                nzKeyboard: false,
                nzTitle: drill.title,
                nzFooter: null,
                nzContent: TableComponent
            });
            ref.getContentComponent().drill = {
                code: drill.code,
                val: id,
                erupt: drill.link.linkErupt,
                eruptParent: this.eruptBuildModel.eruptModel.eruptName
            }
        }

        for (let i in eruptJson.drills) {
            let drill = eruptJson.drills[i];
            if (drill.fold) {
                isFoldButtons = true;
            } else {
                tableButtons.push({
                    type: 'link',
                    tooltip: drill.title,
                    text: `<i class="${drill.icon}"></i>`,
                    click: (record) => {
                        createDrillModel(drill, record[eruptJson.primaryKeyCol]);
                    }
                });
            }
            editButtons.push({
                label: drill.title,
                type: 'dashed',
                onClick(options: ModalButtonOptions<any>) {
                    createDrillModel(drill, options[eruptJson.primaryKeyCol]);
                }
            })
        }

        let getEditButtons = (record:any): ModalButtonOptions[] => {
            for (let editButton of editButtons) {
                editButton['id'] = record[this.eruptBuildModel.eruptModel.eruptJson.primaryKeyCol]
                editButton['data'] = record
            }
            return editButtons;
        }

        if (this.eruptBuildModel.eruptModel.eruptJson.power.edit) {
            let fullLine = false;
            let layout = this.eruptBuildModel.eruptModel.eruptJson.layout;
            if (layout && layout.formSize == FormSize.FULL_LINE) {
                fullLine = true;
            }
            tableOperators.push({
                icon: "edit",
                tooltip: this.l.instant("global.editor"),
                click: (record: any) => {
                    this.openCreateOrEdit(record[this.eruptBuildModel.eruptModel.eruptJson.primaryKeyCol], fullLine, getEditButtons(record));
                },
                iif: (item) => {
                    if (item[TableStyle.power]) {
                        return (<Power>item[TableStyle.power]).edit !== false
                    }
                    return true;
                }
            });
        }
        if (this.eruptBuildModel.eruptModel.eruptJson.power.delete) {
            tableOperators.push({
                icon: {
                    type: "delete",
                    theme: "twotone",
                    twoToneColor: "#f00"
                },
                tooltip: this.l.instant("global.delete"),
                pop: this.l.instant("table.delete.hint"),
                type: "del",
                click: (record) => {
                    // this.dataService.deleteEruptDataList(this.eruptBuildModel.eruptModel.eruptName,
                    //     record[this.eruptBuildModel.eruptModel.eruptJson.primaryKeyCol])
                    //     .subscribe(result => {
                    //         if (result.status === Status.SUCCESS) {
                    //             // if (this.dataPage.data.length <= 1) {
                    //             //     this.query(this.dataPage.pi == 1 ? 1 : this.dataPage.pi - 1);
                    //             // } else {
                    //             //     this.query(this.dataPage.pi);
                    //             // }
                    //             //上面有机会再完善
                    //             this.list.get();
                    //             this.msg.success(this.l.instant('global.delete.success'));
                    //         }
                    //     });

                        //调用通用删除接口
                        this.dataService.delete(this.eruptBuildModel.eruptModel.eruptName,
                        record[this.eruptBuildModel.eruptModel.eruptJson.primaryKeyCol]).subscribe({
                        next: () => {
                            // 你可以在这里刷新列表
                            this.list.get();
                            this.msg.success(this.l.instant('global.delete.success'));
                            this.msg.success('删除成功！');
                        },
                        error: (err) => {
                            console.log('删除失败', err);
                            this.msg.error('删除失败：' + (err.message || '未知错误'));
                        },
                        // =======================
                        // 无论成功失败都会走
                        // =======================
                        complete: () => {
                            console.log('请求已完成');
                        }
                        });


                },
                iif: (item) => {
                    if (item[TableStyle.power]) {
                        return (<Power>item[TableStyle.power]).delete !== false
                    }
                    return true;
                }
            });
        }
        tableOperators.push(...tableButtons);
        if (this.eruptBuildModel.eruptModel.tags?.get("EruptFlow")) {
            tableOperators.push({
                icon: "node-index",
                tooltip: this.l.instant("VIEW_FLOW"),
                click: (record: any, modal: any) => {
                    this.drawerService.create({
                        nzClosable: false,
                        nzKeyboard: true,
                        nzMaskClosable: true,
                        // @ts-ignore
                        nzPlacement: "right",
                        nzWidth: "60%",
                        nzBodyStyle: {
                            padding: 0
                        },
                        nzFooter: undefined,
                        nzContent: EruptIframeComponent,
                        nzContentParams: {
                            url: location.origin + "/#/fill/flow/approval-detail/" + record["__flow_id__"],
                            height: "100%",
                            width: '100%'
                        }
                    })
                },
                iif: (item) => {
                    return item["__flow_id__"];
                }
            });
        }
        if (isFoldButtons) {
            let children: STColumnButton[] = [];
            eruptJson.rowOperation.forEach(ro => {
                if (ro.mode !== OperationMode.BUTTON && ro.mode !== OperationMode.MULTI_ONLY) {
                    ro.fold && children.push({
                        text: (ro.icon && `<i class=\"${ro.icon}\"></i> &nbsp;`) + ro.title,
                        iifBehavior: 'disabled',
                        tooltip: ro.tip,
                        iif: (item) => exprEval(ro.ifExpr, item),
                        click: (record) => that.createOperator(ro, record)
                    })
                }
            });
            eruptJson.drills.forEach(drill => {
                drill.fold && children.push({
                    text: (drill.icon && `<i class=\"${drill.icon}\"></i> &nbsp;`) + drill.title,
                    iifBehavior: 'disabled',
                    // tooltip: drill.title,
                    click: (record) => createDrillModel(drill, record[eruptJson.primaryKeyCol])
                })
            });
            tableOperators.push({
                text: this.l.instant("global.more") + " ",
                children: children
            });
        }
        if (tableOperators.length > 0) {
            _columns.push({
                title: this.l.instant("table.operation"),
                fixed: "right",
                width: eruptJson.layout.tableOperatorWidth ? eruptJson.layout.tableOperatorWidth :
                    ((tableOperators.length + (this.eruptBuildModel.eruptModel.tags?.size || 0)) * 35 + 18 + (isFoldButtons ? 60 : 0)),
                className: "text-center",
                buttons: tableOperators,
                resizable: false
            });
        }
        //this.columns = _columns;
        this.columns.push(..._columns);
        if (eruptJson.layout.tableWidth) {
            this.tableWidth = eruptJson.layout.tableWidth;
        } else {
            this.tableWidth ="100px";
            //this.tableWidth = (this.eruptBuildModel.eruptModel.tableColumns.filter(e => e.show).length * 160 * this.i18n.getCurrLangInfo().columnWidthZoom) + "px"
        }
    }
    
    /**
     * 自定义功能触发
     * @param rowOperation 行按钮对象
     * @param data 数据（单个执行时使用）
     */
    createOperator(rowOperation: RowOperation, data?: any) {
        const eruptModel = this.eruptBuildModel.eruptModel;
        const ro = rowOperation;
        let ids:any[] = [];
        if (data) {
            ids = [data[eruptModel.eruptJson.primaryKeyCol]];
        } else {
            if ((ro.mode === OperationMode.MULTI || ro.mode === OperationMode.MULTI_ONLY) && this.selectedRows.length === 0) {
                this.msg.warning(this.l.instant("table.require.select_one"));
                return;
            }
            this.selectedRows.forEach(e => {
                ids.push(e[eruptModel.eruptJson.primaryKeyCol]);
            });
        }
        if (ro.type === OperationType.TPL) {
            let url = this.dataService.getEruptOperationTpl(this.eruptBuildModel.eruptModel.eruptName, ro.code, ids)??"";
            this.uiBuildService.openTpl(data, ro.title, url, ro.tpl)
        } else if (ro.type === OperationType.ERUPT) {
            let operationErupt: EruptModel | undefined=undefined;
            if (this.eruptBuildModel.operationErupts) {
                operationErupt = this.eruptBuildModel.operationErupts[ro.code];
            }
            if (operationErupt) {
                this.dataHandler.initErupt({eruptModel: operationErupt});
                this.dataHandler.emptyEruptValue({
                    eruptModel: operationErupt
                });
                let modal: NzModalRef = this.modal.create({
                    nzDraggable: true,
                    nzKeyboard: false,
                    nzTitle: ro.title,
                    nzMaskClosable: false,
                    nzCancelText: this.l.instant("global.close"),
                    nzWrapClassName: "modal-lg",
                    nzOnOk: async () => {
                        modal.componentInstance.nzCancelDisabled = true;
                        let eruptValue = this.dataHandler.eruptValueToObject({eruptModel: operationErupt});
                        let res = await this.dataService.execOperatorFun(eruptModel.eruptName, ro.code, ids, eruptValue).toPromise().then(res => res);
                        modal.componentInstance.nzCancelDisabled = false;
                        this.selectedRows = [];
                        if (res.status === Status.SUCCESS) {
                            this.list.get();
                            if (res.data) {
                                this.execExpr(res.data);
                            }
                            return true;
                        } else {
                            return false;
                        }
                    },
                    nzContent: NzDynamicFormComponent //EditTypeComponent
                });
                modal.getContentComponent().mode = Scene.ADD;
                modal.getContentComponent().eruptBuildModel = {eruptModel: operationErupt};
                modal.getContentComponent().parentEruptName = this.eruptBuildModel.eruptModel.eruptName;
                this.dataService.operatorFormValue(this.eruptBuildModel.eruptModel.eruptName, ro.code, ids).subscribe(data => {
                    if (data) {
                        this.dataHandlerService.objectToEruptValue(data, {
                            eruptModel: operationErupt
                        });
                    }
                });
            } else {
                // 兼容旧版本, 无callHint配置的情况
                if (null == ro.callHint) {
                    ro.callHint = this.l.instant("table.hint.operation");
                }
                if (ro.callHint) {
                    this.modal.confirm({
                        nzTitle: ro.title,
                        nzContent: ro.callHint,
                        nzCancelText: this.l.instant("global.close"),
                        nzOnOk: async () => {
                            this.selectedRows = [];
                            let res = await this.dataService.execOperatorFun(this.eruptBuildModel.eruptModel.eruptName, ro.code, ids, null)
                                .toPromise().then();
                            this.list.get();
                            if (res.data) {
                                this.execExpr(res.data);
                            }
                        }
                    });
                } else {
                    this.selectedRows = [];
                    let msgLoading = this.msg.loading(ro.title);
                    this.dataService.execOperatorFun(this.eruptBuildModel.eruptModel.eruptName, ro.code, ids, null).subscribe(res => {
                        this.msg.remove(msgLoading.messageId);
                        if (res.data) {
                            this.execExpr(res.data);
                        }
                    });

                }
            }
        }
    }

    //提供自定义表达式可调用函数
    execExpr(expr: string) {
        let ev = {
            codeModal: (lang: string, code: any) => {
                let ref = this.modal.create({
                    nzDraggable: true,
                    nzKeyboard: true,
                    nzMaskClosable: true,
                    nzCancelText: this.l.instant("global.close"),
                    nzWrapClassName: "modal-lg",
                    nzContent: CodeEditorComponent,
                    nzFooter: null,
                    nzBodyStyle: {padding: '0'}
                });
                ref.getContentComponent().height = 500;
                ref.getContentComponent().readonly = true;
                ref.getContentComponent().language = lang;
                // @ts-ignore
                ref.getContentComponent().edit = {$value: code}
            }
        }
        try {
            new Function(...Object.keys(ev), expr)(...Object.values(ev));
        } catch (e:any) {
            this.msg.error(e);
        }
    }


    protected readonly VisType = VisType;

    constructor(
        public readonly list: ListService,
        private dataHandlerService: DataHandlerService,
        private msg: NzMessageService,
        private modal: NzModalService,
        private appViewService: AppViewService,
        public dataService: DataService,
        private uiBuildService: UiBuildService,
        private drawerService: NzDrawerService
    ) {
    
    }



    @ViewChild("st", {static: false})
    st: STComponent;

    extraRows: Row[] | undefined;

    operationMode = OperationMode;

    showColCtrl: boolean = false;

    deleting: boolean = false;

    clientWidth: number = document.body.clientWidth;

    clientHeight: number = document.body.clientHeight;

    hideCondition: boolean = false;

    alert: Alert | undefined;

    searchErupt: EruptModel | null = null;

    hasSearchFields: boolean = false;

    eruptBuildModel!: EruptBuildModel;

    selectedRows: any[] = [];

    linkTree: boolean = false;

    showTable: boolean = true;

    downloading: boolean = false;

    _drill: DrillInput;

    dataPage: {
        querying: boolean,
        showPagination: boolean
        pageSizes: number[];
        ps: number;
        pi: number;
        sort: Record<string, SortType> | null;
        total: number;
        data: any[];
        multiSort?: string[]
        page: STPage;
        url: string | null
    } = {
        querying: false,
        showPagination: true,
        pageSizes: [10, 20, 50, 100, 300, 500],
        ps: 10,
        pi: 1,
        total: 0,
        data: [],
        sort: null,
        multiSort: [],
        page: {
            show: false,
            toTop: false
        },
        url: null
    };

    vis: Vis[] = [];

    selectedVisIndex: number = 0;

    visOptions: any[] = [];

    adding: boolean = false;

    header: object = {};

    refreshTimeInterval: any;

    existMultiRowFoldButtons: boolean = false;

    tableWidth: string = '';

    showSortPopover: boolean = false;

    sortFields: View[] = [];

    selectedSorts: { field: View, direction: SortType }[] = [];

    tempSelectedField: View | null = null;

    @Input() set drill(drill: DrillInput) {
        this._drill = drill;
    }

    _reference: { eruptBuild: EruptBuildModel, eruptField: EruptFieldModel, mode: SelectMode } | undefined;

    ngOnDestroy(): void {
        if (this.refreshTimeInterval) {
            clearInterval(this.refreshTimeInterval);
        }
    }

    visChange(e: number) {
        this.list.get();
    }

    protected readonly SortType = SortType;

    isNumericOrDateType(field: View): boolean {
        return false;
    }

    getAvailableFields(): View[] {
        return this.sortFields.filter(f => !this.selectedSorts.some(s => s.field.column === f.column));
    }

    addSortField(field: View) {
        if (!this.selectedSorts.some(s => s.field.column === field.column)) {
            this.selectedSorts.push({
                field: field,
                direction: SortType.ASC
            });
        }
    }

    removeSortField(index: number) {
        this.selectedSorts.splice(index, 1);
    }

    onSortDrop(event: CdkDragDrop<Array<{ field: View, direction: SortType }>>) {
        moveItemInArray(this.selectedSorts, event.previousIndex, event.currentIndex);
    }

    applySort() {
        if (this.selectedSorts.length === 0) {
            this.dataPage.sort = null;
        } else {
            const sortObj: Record<string, SortType> = {};
            this.selectedSorts.forEach(sort => {
                sortObj[sort.field.column] = sort.direction;
            });
            this.dataPage.sort = sortObj;
        }
        this.showSortPopover = false;
        this.list.get();
    }

    onFieldSelectChange(field: View) {
        if (field) {
            this.addSortField(field);
            setTimeout(() => {
                this.tempSelectedField = null;
            }, 0);
        }
    }
    pageIndexChange(index:any) {
        // ListService 控制页码：page 从 1 开始
        this.list.page = index;
        
        // 触发重新请求 → 自动跳页
        this.list.get();
    }
    pageSizeChange(size:any) {
        //this.query(1, size);
        this.list.maxResultCount=size;
        // 触发重新请求 → 自动跳页
        this.list.get();
    }

    // excel导入
    importableExcel() {
        let model = this.modal.create({
            nzDraggable: true,
            nzKeyboard: true,
            nzTitle: "Excel " + this.l.instant("l.instantport"),
            nzOkText: null,
            nzCancelText: this.l.instant("global.close") + "（ESC）",
            nzWrapClassName: "modal-lg",
            nzContent: ExcelImportComponent,
            nzOnCancel: () => {
                if (model.getContentComponent().upload) {
                    this.query();
                }
            }
        });
        model.getContentComponent().eruptModel = this.eruptBuildModel.eruptModel;
        model.getContentComponent().drillInput = this._drill;
    }
    downloadExcelTemplate() {
        this.dataService.downloadExcelTemplate(this.eruptBuildModel.eruptModel.eruptName);
    }
    // excel导出
    exportExcel() {
        let condition  :QueryCondition[] = [];
        if (this.searchErupt && this.searchErupt.eruptFieldModels.length > 0) {
            condition = this.dataHandler.eruptObjectToCondition(
                this.dataHandler.searchEruptToObject({
                    eruptModel: this.searchErupt
                })
            );
        }
        //导出接口
        this.downloading = true;
        // this.dataService.downloadExcel(this.eruptBuildModel.eruptModel.eruptName, condition,
        //     this._drill ? DataService.drillToHeader(this._drill) : {},
        //     () => {
        //         this.downloading = false;
        //     }
        // );
  
       condition.push({
                key: 'maxResultCount',
                value: 2000
            });
              condition.push({
                key: 'skipCount',
                value: 0
            });
              condition.push({
                key: 'sorting',
                value: ''
            });
       this.dataService.downloadExcel(this.eruptBuildModel.eruptModel.eruptName, condition, this._drill ? DataService.drillToHeader(this._drill) : {},
            () => {
                this.downloading = false;
            })
            .subscribe({
                    next: (blob) => {
                          // 直接下载，不依赖 header，永远成功
    const fileName = `${this.eruptBuildModel.eruptModel.eruptName}_${new Date().getTime()}.xlsx`;
    saveAs(blob, fileName);


    //                 // 从响应头获取文件名（ABP 唯一正确方式）
    //   const fileName = this.getFileNameFromDisposition(blob);
    //   // 执行下载
    //   saveAs(blob, fileName);


//       const blob = res.body;
//   const headers = res.headers;
//   const fileName = this.getFileName(headers);
//   saveAs(blob, fileName);


                        // // 1. 创建下载链接
                        // const downloadUrl = window.URL.createObjectURL(blob);
                        // const a = document.createElement('a');
                        // a.href = downloadUrl;

                        // // 2. 设置下载文件名（和后端保持一致）
                        // a.download = '考勤判定记录.xlsx';

                        // // 3. 触发下载 并 清理
                        // document.body.appendChild(a);
                        // a.click();
                        // document.body.removeChild(a);
                        // window.URL.revokeObjectURL(downloadUrl);
                    },
                    error: (err) => {
                        console.error('导出失败', err);
                        alert('Excel导出失败！');
                    },
                    complete: () => {
                    this.downloading = false;
                    }
            });



    }  

    private getFileName(headers: any) {
  const disp = headers.get('content-disposition');
  if (!disp) return '报表.xlsx';

  const match = disp.match(/filename\*=UTF-8''([^;]+)/i);
  if (match) return decodeURIComponent(match[1]);

  const old = disp.match(/filename=([^;]+)/i);
  if (old) return old[1].replace(/"/g, '');

  return '报表.xlsx';
}
    // 自动解析文件名（兼容你的响应头）
private getFileNameFromDisposition(blob: Blob): string {
  // @ts-ignore
  const disposition = blob['headers']?.get('content-disposition');
  
  if (!disposition) {
    return '考勤报表.xlsx';
  }

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const simpleMatch = disposition.match(/filename=([^;]+)/i);
  if (simpleMatch && simpleMatch[1]) {
    return simpleMatch[1].replace(/"/g, '');
  }

  return '考勤报表.xlsx';
}
/**
   * 从 content-disposition 自动解析文件名
   * 支持中文、UTF8 编码
   */
  private getFileNameFromDisposition2(headers:any): string {
    const disposition = headers.get('content-disposition');
    if (!disposition) return '考勤导出.xlsx';

    const fileNameReg = /filename\*=UTF-8''([^;]+)/i;
    const matches = fileNameReg.exec(disposition);

    if (matches && matches[1]) {
      return decodeURIComponent(matches[1]);
    }

    const oldNameReg = /filename=([^;]+)/i;
    const oldMatches = oldNameReg.exec(disposition);
    if (oldMatches && oldMatches[1]) {
      return oldMatches[1].replace(/"/g, '');
    }

    return '考勤导出.xlsx';
  }


    query() {
        this.list.get();
    }
   
    //批量删除
    delRows() {
        if (!this.selectedRows || this.selectedRows.length === 0) {
            this.msg.warning(this.l.instant("table.select_delete_item"));
            return;
        }
        const ids :any[]= [];
        this.selectedRows.forEach(e => {
            ids.push(e[this.eruptBuildModel.eruptModel.eruptJson.primaryKeyCol]);
        });
        if (ids.length > 0) {
            this.modal.confirm(
                {
                    nzTitle: this.l.instant("table.hint_delete_number").replace("{}", ids.length + ""),
                    nzContent: "",
                    nzOnOk: async () => {
                        this.deleting = true;
                        try {
                            let res = await this.dataService.deleteEruptDataList(this.eruptBuildModel.eruptModel.eruptName, ids).toPromise().then(res => res);
                            this.deleting = false;
                            if (res.status == Status.SUCCESS) {
                                // if (this.selectedRows.length == this.dataPage.data.length) {
                                //     this.query(this.dataPage.pi == 1 ? 1 : this.dataPage.pi - 1);
                                // } else {
                                //     this.query(this.dataPage.pi);
                                // }
                                this.query();
                                this.selectedRows = [];
                                this.msg.success(this.l.instant("global.delete.success"));
                            }
                        } catch (e) {
                            this.deleting = false;
                        }
                    }
                }
            );
        } else {
            this.msg.error(this.l.instant("table.select_delete_item"));
        }
    }


    clickTreeNode(event: string[]) {
        this.showTable = true;
        this.eruptBuildModel.eruptModel.eruptJson.linkTree.value = event;
        //this.searchErupt.eruptJson.linkTree.value = event;
        this.query();
    }

}