export class WindowModel {

    public static VIS_TPL_DATA_KEY: string = "visTplData";

    public static config: Record<string, any> = (window as any)["eruptSiteConfig"] || {};

    public static domain: string = WindowModel.config["domain"] ? WindowModel.config["domain"] + "/" : '';

    public static fileDomain: string | undefined = WindowModel.config["fileDomain"] || undefined;

    public static amapKey: string | undefined;

    public static amapSecurityJsCode: string | undefined;

    public static title: string | undefined;

    public static desc: string | undefined;

    public static logoPath: string | undefined;

    public static logoFoldPath: string | undefined;

    public static loginLogoPath: string | undefined;

    public static logoText: string = "";

    public static registerPage: string | undefined;

    public static copyright: boolean | undefined;

    public static copyrightTxt: any;

    public static theme: {
        primaryColor?: string,
        [key: string]: any
    } = {};

    public static r_tools: CustomerTool[] = [];

    public static userTools: UserTool[] = [];

    public static upload: Function | undefined;

    public static init(): void {
        WindowModel.r_tools = WindowModel.config["r_tools"] || [];
        WindowModel.userTools = WindowModel.config["userTools"] || [];
        WindowModel.amapKey = WindowModel.config["amapKey"];
        WindowModel.amapSecurityJsCode = WindowModel.config["amapSecurityJsCode"];
        WindowModel.title = WindowModel.config["title"] === null ? 'Erupt Engine' : WindowModel.config["title"];
        WindowModel.desc = WindowModel.config["desc"] || undefined;
        WindowModel.logoPath = WindowModel.config["logoPath"] === '' ? undefined : (WindowModel.config["logoPath"] || "erupt.svg");
        WindowModel.logoFoldPath = WindowModel.config["logoFoldPath"] || WindowModel.logoPath;
        WindowModel.loginLogoPath = WindowModel.config["loginLogoPath"] === '' ? undefined : (WindowModel.config["loginLogoPath"] || WindowModel.logoPath);
        WindowModel.logoText = WindowModel.config["logoText"] || "";
        WindowModel.registerPage = WindowModel.config["registerPage"] || undefined;
        WindowModel.copyright = WindowModel.config["copyright"];
        WindowModel.copyrightTxt = WindowModel.config["copyrightTxt"];
        WindowModel.upload = WindowModel.config["upload"] || undefined;
        WindowModel.theme = WindowModel.config["theme"] || {};
    }

    public static eruptEvent: Record<string, EventCycle | undefined> = (window as any)["eruptEvent"] || {};

    public static eruptRouterEvent: Record<string, EventCycle | undefined> = (window as any)["eruptRouterEvent"] || {};
}

interface EventCycle {
    load?: (e?: any) => void,
    unload?: (e?: any) => void,
}

export interface UserTool {
    icon: string;
    text: string;
    click(event: Event): void;
}


export interface CustomerTool {
    icon: string;
    text: string;
    mobileHidden: boolean;
    render: string | Function;
    load(): void;
    click(event: Event): void;
}