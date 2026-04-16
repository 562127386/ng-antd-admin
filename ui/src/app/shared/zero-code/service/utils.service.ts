/**
 * Created by liyuepeng on 10/16/19.
 */
import {Inject, Injectable} from "@angular/core";
import {LazyService} from "@delon/util";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";

@Injectable()
export class UtilsService {

    constructor(
        private lazy: LazyService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {
    }

    isTenantToken(): boolean {
        const token = this.tokenService.get()?.token;
        return !!token && token.split(".").length === 3;
    }

    async loadScript(src: string): Promise<void> {
        await this.lazy.loadScript(src).then(res => res);
    }

    async loadStyle(src: string): Promise<void> {
        await this.lazy.loadStyle(src).then(res => res);
    }
}