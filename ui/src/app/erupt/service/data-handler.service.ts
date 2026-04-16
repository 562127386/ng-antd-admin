import {EruptBuildModel} from "../model/erupt-build.model";
import {Injectable} from "@angular/core";
import { EruptModel } from "../model/erupt.model";
import { QueryCondition } from "../model/erupt.vo";

@Injectable()
export class DataHandlerService {
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

    initErupt(eb: EruptBuildModel): void {
    }

    emptyEruptValue(eb: EruptBuildModel): void {
    }

    objectToEruptValue(data: any, eb: EruptBuildModel | null): void {
    }
}