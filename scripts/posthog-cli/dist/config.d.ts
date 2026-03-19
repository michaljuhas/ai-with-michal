export interface PostHogConfig {
    personalApiKey: string;
    projectApiKey: string;
    projectId: string;
    host: string;
    ingestionHost: string;
}
export declare class ConfigError extends Error {
    constructor(message: string);
}
export declare function getConfigPath(): string;
export declare function loadConfig(): PostHogConfig;
export declare function setConfigValue(key: string, value: string): void;
