declare const window: any;

export interface TenantDomainInfo {
    domain: string;
    tenantId: string;
    tenantName: string;
}

export interface TenantInfo {
    domainInfo: TenantDomainInfo | null;
}

const eruptTenantDomainInfo: TenantDomainInfo | null = window["eruptTenantDomainInfo"] || null;

export const eruptTenant: TenantInfo = {
    domainInfo: eruptTenantDomainInfo
};