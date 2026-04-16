import {EruptBuildModel} from "../model/erupt-build.model";
import {DateEnum, EditType, PagingType, ViewType} from "../model/erupt.enum";
import {ViewTypeComponent} from "../components/view-type/view-type.component";
//import {MarkdownComponent} from "../components/markdown/markdown.component";
import {CodeEditorComponent} from "../components/code-editor/code-editor.component";
import {Inject, Injectable} from "@angular/core";
//import {I18NService} from "@core";
import {STColumn, STData} from "@delon/abc/st";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzImageService} from "ng-zorro-antd/image";
import {OpenWay, PageEmbedType, Tpl, View} from "../model/erupt-field.model";
import {AttachmentSelectComponent} from "../components/attachment-select/attachment-select.component";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {Router} from "@angular/router";
import { DataService } from "@app/shared/zero-code/data.service";
import { LocalizationService } from "@abp/ng.core";

@Injectable()
export class UiBuildService {

    constructor(
        private imageService: NzImageService,
        //private i18n: I18NService,
        public readonly l: LocalizationService,
        private dataService: DataService,
        private router: Router,
        @Inject(NzDrawerService) private drawerService: NzDrawerService,
        @Inject(NzModalService) private modal: NzModalService,
        @Inject(NzMessageService) private msg: NzMessageService) {
    }


    /**
     * 将view数据转换为alain table组件配置信息
     * @param eruptBuildModel ebm
     * @param lineData
     *     true   数据形式为一整行txt
     *     false  数据形式为：带有层级的json
     * @param dataConvert 是否需要数据转换,如bool转换，choice转换
     */
    viewToAlainTableConfig(eruptBuildModel: EruptBuildModel, lineData: boolean, dataConvert?: boolean): STColumn[] {
        let cols: STColumn[] = [];
        const views = eruptBuildModel.eruptModel.tableColumns??[];
        let layout = eruptBuildModel.eruptModel.eruptJson.layout;
        let i = 0;
        for (let view of views) {
            let titleWidth: number = view.title.length * 16 + 22;
            if (titleWidth > 280) {
                titleWidth = 280;
            }
            if (view.sortable) {
                titleWidth += 20;
            }
            if (view.desc) {
                titleWidth += 18;
            }
            let edit = view.eruptFieldModel?.eruptFieldJson.edit;
            let obj: STColumn = {
                title: {
                    text: view.title,
                    optional: "   ",
                    optionalHelp: view.desc
                },
                iif: () => view.show,
            };
            //obj["show"] = view.show;    这个先注释20260411
            if (lineData) {
                //修复表格显示子类属性时无法正确检索到属性值的缺陷
                obj.index = view.column.replace(/\./g, "_");
            } else {
                obj.index = view.column;
            }
            if (view.sortable) {
                obj.sort = {
                    reName: {
                        ascend: "asc",
                        descend: "desc"
                    },
                    key: view.column,
                    compare: ((a: STData, b: STData) => {
                        return a[view.column] > b[view.column] ? 1 : -1;
                    })
                };
            }

            switch (view.eruptFieldModel?.eruptFieldJson.edit?.type) {
                case EditType.TAGS:
                    obj.className = "text-center";
                    obj.format = (item: any) => {
                        let value = item[view.column];
                        if (value) {
                            let result = "";
                            for (let ele of value.split(view.eruptFieldModel?.eruptFieldJson.edit?.tagsType?.joinSeparator)) {
                                result += "<span class='e-tag'>" + ele + "</span>";
                            }
                            return result;
                        } else {
                            return value;
                        }
                    };
                    break;
                case EditType.CHOICE:
                    obj.format = (item: any) => {
                        if (item[view.column] != null) {
                            if (dataConvert) {
                                return "<span style='color:" + view.eruptFieldModel?.choiceMap?.get(item[view.column] + "")?.color + "'>"
                                    + view.eruptFieldModel?.choiceMap?.get(item[view.column] + "")?.label
                                    + "</span>";
                            } else {
                                return "<span style='color:" + view.eruptFieldModel?.choiceLabelMap?.get(item[view.column] + "")?.color + "'>"
                                    + item[view.column]
                                    + "</span>";
                            }
                        } else {
                            return "";
                        }
                    };
                    break;
            }

            obj.width = titleWidth;
            //展示类型
            switch (view.viewType) {
                case ViewType.TEXT:
                    obj.width = undefined;
                    obj.className = "text-col";
                    break;
                case ViewType.SAFE_TEXT:
                    obj.width = undefined;
                    obj.className = "text-col";
                    obj.safeType = "text"
                    break
                case ViewType.NUMBER:
                    obj.className = "text-right";
                    break;
                case ViewType.COLOR:
                    obj.className = "text-center";
                    obj.type = "link";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return `<i class="fa fa-square" style="color: ${item[view.column]};font-size: 1.2rem" aria-hidden="true"></i>`;
                        } else {
                            return "";
                        }
                    };
                    break;
                case ViewType.DATE:
                    obj.className = "date-col";
                    obj.width = 115;
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            let val = <string>item[view.column];
                            if (view.eruptFieldModel?.eruptFieldJson.edit?.dateType?.type == DateEnum.DATE && !val.startsWith("<") && !val.endsWith(">")) {
                                return val.substring(0, 10);
                            } else {
                                return val;
                            }
                        } else {
                            return "";
                        }
                    };
                    break;
                case ViewType.DATE_TIME:
                    obj.className = "date-col";
                    obj.width = 180;
                    break;
                case ViewType.BOOLEAN:
                    obj.className = "text-center";
                    obj.width = titleWidth + 18;
                    obj.type = "tag";
                    if (dataConvert) {
                        obj.tag = {
                            true: {text: edit?.boolType?.trueText, color: 'green'},
                            false: {text: edit?.boolType?.falseText, color: 'red'},
                        };
                    } else {
                        if (edit?.title) {
                            if (edit.boolType) {
                                obj.tag = {
                                    [edit.boolType.trueText]: {
                                        text: edit.boolType.trueText,
                                        color: 'green'
                                    },
                                    [edit.boolType.falseText]: {
                                        text: edit.boolType.falseText,
                                        color: 'red'
                                    },
                                };
                            }
                        } else {
                            obj.tag = {
                                true: {text: this.l.instant('是'), color: 'green'},
                                false: {text: this.l.instant('否'), color: 'red'},
                            };
                        }
                    }
                    break;
                case ViewType.LINK:
                    obj.type = "link";
                    obj.className = "text-center";
                    obj.click = (item) => {
                        window.open(item[view.column]);
                    };
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return "<i class='fa fa-link' aria-hidden='true' title=''></i>";
                        } else {
                            return "";
                        }
                    };
                    break;
                case ViewType.LINK_DIALOG:
                    obj.className = "text-center";
                    obj.type = "link";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return "<i class='fa fa-dot-circle-o' aria-hidden='true' title=''></i>";
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-lg modal-body-nopadding",
                            nzStyle: {top: "20px"},
                            nzMaskClosable: false,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: ViewTypeComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            value: item[view.column],
                            view: view
                        });

                    };
                    break;
                case ViewType.QR_CODE:
                    obj.className = "text-center";
                    obj.type = "link";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return "<i class='fa fa-qrcode' aria-hidden='true' title=''></i>";
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-sm",
                            nzMaskClosable: true,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: ViewTypeComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            value: item[view.column],
                            view: view
                        });
                    };
                    break;
                // case ViewType.MARKDOWN:
                //     obj.className = "text-center";
                //     obj.type = "link";
                //     obj.format = (item: any) => {
                //         if (item[view.column]) {
                //             return "<i class='fa fa-file-text' aria-hidden='true' title=''></i>";
                //         } else {
                //             return "";
                //         }
                //     };
                //     obj.click = (item) => {
                //         let ref = this.modal.create({
                //             nzDraggable: true,
                //             nzWrapClassName: "modal-lg",
                //             nzStyle: {top: "24px"},
                //             nzBodyStyle: {padding: "0"},
                //             nzMaskClosable: true,
                //             nzKeyboard: true,
                //             nzFooter: null,
                //             nzTitle: view.title,
                //             //nzContent: MarkdownComponent
                //         });
                //         view.eruptFieldModel?.eruptFieldJson.edit.$value = item[view.column];
                //         Object.assign(ref.getContentComponent(), {
                //             value: item[view.column],
                //             readonly: true,
                //             erupt: eruptBuildModel.eruptModel,
                //             eruptField: view.eruptFieldModel
                //         });

                //     };
                //     break;
                case ViewType.CODE:
                    obj.className = "text-center";
                    obj.type = "link";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return "<i class='fa fa-code' aria-hidden='true' title=''></i>";
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        let codeEditType = view.eruptFieldModel?.eruptFieldJson.edit?.codeEditType;
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-lg",
                            nzBodyStyle: {padding: "0"},
                            nzMaskClosable: true,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: CodeEditorComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            height: 500,
                            readonly: true,
                            language: codeEditType ? codeEditType.language : 'text',
                            // @ts-ignore
                            edit: {
                                $value: item[view.column]
                            }
                        });

                    };
                    break;
                case ViewType.MAP:
                    obj.className = "text-center";
                    obj.type = "link";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return "<i class='fa fa-map' aria-hidden='true' title=''></i>";
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-lg",
                            nzBodyStyle: {
                                padding: "0"
                            },
                            nzMaskClosable: true,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: ViewTypeComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            value: item[view.column],
                            view: view
                        });

                    };
                    break;
                case ViewType.IMAGE:
                    obj.type = "link";
                    obj.className = "text-center p-mini";
                    obj.width = titleWidth + 30;
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            const attachmentType = view.eruptFieldModel?.eruptFieldJson.edit?.attachmentType;
                            let imgs;
                            if (attachmentType) {
                                imgs = (<string>item[view.column]).split(attachmentType.fileSeparator);
                            } else {
                                imgs = (<string>item[view.column]).split("|");
                            }
                            let imgElements :any[]= [];
                            for (let i in imgs) {
                                imgElements[i] = `<img width="100%" class="e-table-img" src="${DataService.previewAttachment(imgs[i])}" alt="${imgs[i]}"/>`;
                            }
                            return `<div style="text-align: center;display:flex;justify-content: center;" title="${view.title}">
                                        ${imgElements.join(" ")}
                                    </div>`;
                        } else {
                            return '';
                        }
                    };
                    obj.click = (item) => {
                        this.imageService.preview(item[view.column].split("|").map((it:any) => {
                            return {
                                src: DataService.previewAttachment(it.trim())
                            }
                        }))
                    };
                    break;
                case ViewType.HTML:
                    obj.type = "link";
                    obj.className = "text-center";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return `<i class='fa fa-file-text' aria-hidden='true' title=''></i>`;
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-lg",
                            nzStyle: {top: "50px"},
                            nzMaskClosable: true,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: ViewTypeComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            value: item[view.column],
                            view: view
                        });
                    };
                    break;
                case ViewType.MOBILE_HTML:
                    obj.className = "text-center";
                    obj.type = "link";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return "<i class='fa fa-file-text' aria-hidden='true' title=''></i>";
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-xs",
                            nzMaskClosable: true,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: ViewTypeComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            value: item[view.column],
                            view: view
                        });

                    };
                    break;
                case ViewType.SWF:
                    obj.type = "link";
                    obj.className = "text-center";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return `<i class='fa fa-file-image-o' aria-hidden='true' title=''></i>`;
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-lg modal-body-nopadding",
                            nzStyle: {top: "40px"},
                            nzMaskClosable: true,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: ViewTypeComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            value: item[view.column],
                            view: view
                        })
                    };
                    break;
                case ViewType.IMAGE_BASE64:
                    obj.type = "link";
                    obj.width = "90px";
                    obj.className = "text-center p-sm";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return `<img width="100%" alt="${obj.title}" src="${item[view.column]}" title=""/>`;
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-lg",
                            nzStyle: {top: "50px", textAlign: 'center'},
                            nzMaskClosable: true,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: ViewTypeComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            value: item[view.column],
                            view: view
                        });
                    };
                    break;
                case ViewType.ATTACHMENT_DIALOG:
                    obj.type = "link";
                    obj.className = "text-center";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return `<i class='fa fa-dot-circle-o' aria-hidden='true' title=""></i>`;
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        this.attachmentView(view, item[view.column]);
                    };
                    break;
                case ViewType.DOWNLOAD:
                    obj.type = "link";
                    obj.className = "text-center";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return `<i class='fa fa-download' aria-hidden='true' title=""></i>`;
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        this.attachmentView(view, item[view.column]);
                    };
                    break;
                case ViewType.ATTACHMENT:
                    obj.type = "link";
                    obj.className = "text-center";
                    obj.format = (item: any) => {
                        if (item[view.column]) {
                            return `<i class='fa fa-window-restore' aria-hidden='true' title=""></i>`;
                        } else {
                            return "";
                        }
                    };
                    obj.click = (item) => {
                        this.attachmentView(view, item[view.column]);
                    };
                    break;
                case ViewType.TAB_VIEW:
                    obj.type = "link";
                    obj.className = "text-center";
                    obj.format = (item: any) => {
                        return `<i class='fa fa-adjust' aria-hidden='true' title=""></i>`;
                    };
                    obj.click = (item) => {
                        let ref = this.modal.create({
                            nzDraggable: true,
                            nzWrapClassName: "modal-lg",
                            nzStyle: {top: "50px"},
                            nzMaskClosable: false,
                            nzKeyboard: true,
                            nzFooter: null,
                            nzTitle: view.title,
                            nzContent: ViewTypeComponent
                        });
                        Object.assign(ref.getContentComponent(), {
                            value: item[eruptBuildModel.eruptModel.eruptJson.primaryKeyCol],
                            eruptBuildModel: eruptBuildModel,
                            view: view
                        });

                    };
                    break;
                default:
                    obj.width = undefined;
                    break;
            }
            if (view.template) {
                obj.format = (item: any) => {
                    try {
                        let value = item[view.column];
                        return new Function('value', "return " + view.template)(value);
                    } catch (e:any) {
                        console.error(e);
                        this.msg.error(e.toString());
                    }
                };
            }
            if (view.className) {
                obj.className += " " + view.className;
            }
            if (obj.width && <number>obj.width < titleWidth) {
                obj.width = titleWidth;
            }
            if (view.width) {
                obj.width = isNaN(Number(view.width)) ? view.width : view.width + "px";
            }
            if (view.tpl && view.tpl.enable) {
                obj.type = "link"
                obj.click = (item) => {
                    let url = this.dataService.getEruptViewTpl(eruptBuildModel.eruptModel.eruptName,
                        view.eruptFieldModel?.fieldName??"",
                        item[eruptBuildModel.eruptModel.eruptJson.primaryKeyCol])??'';
                    this.openTpl(item, view.title, url, view.tpl);
                };
            }
            if (layout.pagingType == PagingType.BACKEND) {
                if (view.sortable) {
                    obj.sort = {
                        compare: null,
                        reName: {
                            ascend: 'asc',
                            descend: 'desc'
                        }
                    }
                }
            }
            if (layout) {
                if (i < layout.tableLeftFixed) {
                    obj.fixed = 'left';
                }
                if (i >= views.length - layout.tableRightFixed) {
                    obj.fixed = 'right';
                }
            }

            if (null != obj.fixed && null == obj.width) {
                obj.width = titleWidth + 50;
            }
            cols.push(obj);
            i++;
        }
        return cols;
    }
    attachmentView(view: View, arg1: any) {
        throw new Error("Method not implemented.");
    }

    openTpl(data: any, title: string, url: string, tpl: any): void {
    }

    openTpl3(eruptName: string, code: string, ids: any[], eruptValue: any): void {
    }

    openTpl2(eruptName: string, code: string, ids: any[]): void {
    }
}