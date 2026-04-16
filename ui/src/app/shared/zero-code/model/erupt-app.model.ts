export interface EruptAppModel {
    verifyCodeCount: number;
    pwdTransferEncrypt: boolean;
    locales: string[];
    hash: number;
    version: string;
    loginPagePath: string;
    waterMark: boolean;
    resetPwd: boolean;
    properties: object;
}

let eruptAppConfig: EruptAppModel = (window as any)["eruptApp"] || {} as EruptAppModel;

export class EruptAppData {

    static get(): EruptAppModel {
        return eruptAppConfig;
    }

    static put(value: EruptAppModel): void {
        eruptAppConfig = value;
    }
}