import {Injectable} from "@angular/core";

export enum ContextKey {
    INIT_MICRO_APP = 'INIT_MICRO_APP'
}

@Injectable()
export class EruptContextService {

    private contextValue: Record<string, any> = {};

    set(key: ContextKey, value: any): void {
        this.contextValue[key as unknown as string] = value;
    }

    get(key: ContextKey): any {
        return this.contextValue[key as unknown as string];
    }

    has(key: ContextKey): boolean {
        return !!this.contextValue[key as unknown as string];
    }
}