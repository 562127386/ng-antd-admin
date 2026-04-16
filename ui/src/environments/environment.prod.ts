// 生产环境配置
// API 服务器地址
export const API_URL = 'http://192.168.31.244:44312';

// WebSocket 地址
export const WS_URL = 'ws://192.168.31.244:8003';

export const environment = {
  apiUrl: API_URL,
  wsUrl: WS_URL,
  production: true,
  application: {
    name: 'CmsKit',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44318',
    clientId: 'CmsKit_ConsoleTestApp',
    dummyClientSecret: '1q2w3e*',
    scope: 'CmsKit',
    showDebugInformation: true,
    oidc: false,
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44318',
    },
    CmsKit: {
      url: 'https://localhost:44371',
    },
  },
};
