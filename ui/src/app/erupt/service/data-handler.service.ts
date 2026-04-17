import {EruptBuildModel} from "../model/erupt-build.model";
import {Injectable} from "@angular/core";
import { EruptModel, Tree } from "../model/erupt.model";
import { QueryCondition } from "../model/erupt.vo";
import { NzTreeNodeOptions } from "ng-zorro-antd/tree";
import { EruptFieldModel, VL } from "../model/erupt-field.model";
import { EditType } from "../model/erupt.enum";
import {deepCopy} from "@delon/util";

@Injectable()
export class DataHandlerService {
    dataTreeToZorroTree(nodes: Tree[], expandLevel: number): NzTreeNodeOptions[] {
        const tempNodes: NzTreeNodeOptions[] = [];
        nodes.forEach(node => {
            let option: any = {
                key: node.id,
                title: node.label,
                data: node.data,
                expanded: node.level <= expandLevel
            };
            if (node.children && node.children.length > 0) {
                tempNodes.push(option);
                option.children = this.dataTreeToZorroTree(node.children, expandLevel);
            } else {
                option.isLeaf = true;
                tempNodes.push(option);
            }
        });
        return tempNodes;
    }
    
    eruptValueToObject(arg0: { eruptModel: EruptModel; }) {
        throw new Error("Method not implemented.");
    }
    searchEruptToObject(arg0: { eruptModel: EruptModel | null; }): any {
        throw new Error("Method not implemented.");
    }
    eruptObjectToCondition(obj: any): any {
        let queryCondition: QueryCondition[] = [];
        for (let key in obj) {
            let val = obj[key];
            if (typeof val == "string") {
                val = val.trim();
            }
            queryCondition.push({
                key: key,
                value: val
            });
        }
        return queryCondition;
    }

    constructor() {
    }

    initErupt(em: EruptBuildModel) {
        this.buildErupt(em.eruptModel);
        if(em.power)em.eruptModel.eruptJson.power = em.power;
        if (em.tabErupts) {
            for (let key in em.tabErupts) {
                if ("eruptName" in em.tabErupts[key].eruptModel) {
                    this.initErupt(em.tabErupts[key]);
                }
            }
        }
        if (em.combineErupts) {
            for (let key in em.combineErupts) {
                this.buildErupt(em.combineErupts[key]);
            }
        }
        if (em.referenceErupts) {
            for (let key in em.referenceErupts) {
                this.buildErupt(em.referenceErupts[key]);
            }
        }
    }

        buildErupt(eruptModel: EruptModel) {
        eruptModel.tableColumns = [];
        eruptModel.eruptFieldModelMap = new Map<String, EruptFieldModel>();
        eruptModel.eruptFieldModels.forEach(field => {
            if (!field.eruptFieldJson.edit) {
                return;
            }
            if (field.componentValue) {
                field.choiceMap = new Map<String, VL>();
                field.choiceLabelMap = new Map<String, VL>()
                for (let vl of field.componentValue) {
                    field.choiceMap.set(vl.value, vl);
                    field.choiceLabelMap.set(vl.label, vl)
                }
            }
            field.eruptFieldJson.edit.$value = field.value;
            eruptModel.eruptFieldModelMap?.set(field.fieldName, field);
            switch (field.eruptFieldJson.edit.type) {
                case EditType.INPUT:
                    const inputType = field.eruptFieldJson.edit.inputType;
                    if(inputType){
                        if (inputType.prefix.length > 0) {
                            inputType.prefixValue = inputType.prefix[0].value;
                        }
                        if (inputType?.suffix.length > 0) {
                            inputType.suffixValue = inputType.suffix[0].value;
                        }
                    }
                    break;
                case EditType.SLIDER:
                    const markPoints = field.eruptFieldJson.edit.sliderType?.markPoints??[];
                    //后期使用再完善
                    // const marks = field.eruptFieldJson.edit.sliderType?.marks = {};
                    // if (markPoints.length > 0) {
                    //     markPoints.forEach(m => {
                    //         marks[m] = "";
                    //     });
                    // }
                    break;
            }
            //生成columns
            field.eruptFieldJson.views?.forEach(view => {
                if (view.column) {
                    //修复表格显示子类属性时无法正确检索到属性值的缺陷
                    view.column = field.fieldName + "_" + view.column.replace(/\./g, "_");
                } else {
                    view.column = field.fieldName;
                }
                const deepField = <EruptFieldModel>deepCopy(field);
                deepField.eruptFieldJson.views = undefined;
                view.eruptFieldModel = deepField;
                eruptModel.tableColumns?.push(view);
            });
        });
    }
    
    emptyEruptValue(eb: EruptBuildModel): void {
    }

    objectToEruptValue(data: any, eb: EruptBuildModel | null): void {
    }
}