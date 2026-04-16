/**
 * Created by liyuepeng on 10/16/19.
 */
import {Injectable} from "@angular/core";

const searchKey = "search";

const columnKey = "column";

@Injectable()
export class EruptStorageService {

    constructor() {
    }

    saveSearch(code: string, query: any): void {
        this.save(code, searchKey, query);
    }

    getSearch(code: string): any[] {
        return this.get(code, searchKey);
    }

    clearSearch(code: string): void {
        this.delete(code, searchKey);
    }

    private save(code: string, key: string, query: any): void {
        const dataStr = localStorage.getItem(code);
        const data: Record<string, any> = {};
        if (dataStr) {
            const parsed = JSON.parse(dataStr);
            Object.assign(data, parsed);
        }
        data[key] = query;
        localStorage.setItem(code, JSON.stringify(data));
    }

    private get(code: string, key: string): any {
        const dataStr = localStorage.getItem(code);
        if (dataStr) {
            const data = JSON.parse(dataStr);
            return data[key];
        }
        return null;
    }

    private delete(code: string, key: string): void {
        const dataStr = localStorage.getItem(code);
        if (dataStr) {
            const data = JSON.parse(dataStr);
            delete data[key];
            localStorage.setItem(code, JSON.stringify(data));
        }
    }
}

export interface eruptStorage {
    search: any;
    table: Record<string, {
        width: number;
    }>
}