import { Environment } from '@abp/ng.core';
// 开发环境配置
// API 服务器地址
export const API_URL = 'https://localhost:44312';
const baseUrl = 'http://localhost:4205';
// WebSocket 地址
export const WS_URL = 'ws://localhost:8003';

export const environment = {
  apiUrl: API_URL,
  wsUrl: WS_URL,
  production: false,
  application: {
    name: 'CmsKit',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44312/',
    redirectUri: baseUrl,
    clientId: 'MyProjectName_App',
    responseType: 'code',
    scope: 'offline_access MyProjectName',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44312',
      rootNamespace: 'LG.TQMS',
    },
  },
} as Environment;

