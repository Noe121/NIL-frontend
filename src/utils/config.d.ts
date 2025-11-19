export declare const APP_MODE: string;
export declare const IS_STANDALONE: boolean;
export declare const IS_CENTRALIZED: boolean;
export declare const IS_PER_SERVICE: boolean;
export declare const IS_DEV: boolean;
export declare const IS_PROD: boolean;

export interface ApiConfig {
  apiUrl: string;
  authUrl: string;
  crmApiUrl: string;
  crmApiVersion: string;
  ui: {
    apiTimeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  auth: {
    storageKey: string;
    refreshThreshold: number;
  };
  services: {
    auth: string;
    api: string;
    crm: string;
  };
}

export declare const config: ApiConfig;

export declare function logConfig(): void;
export declare function checkServiceHealth(serviceName: string, url: string): Promise<boolean>;
export declare function initializeApp(): Promise<void>;
export declare function createApiRequest(endpoint: string, options?: any): Promise<any>;
export declare function checkAllServices(): Promise<any>;
export declare const utils: any;
export declare function getApiConfig(): ApiConfig;
export declare function isBlockchainEnabled(): boolean;
export declare function makeApiRequest(endpoint: string, options?: any): Promise<any>;
export declare function useConfig(): ApiConfig;

export default config;
