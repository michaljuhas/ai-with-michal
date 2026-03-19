"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigError = void 0;
exports.getConfigPath = getConfigPath;
exports.loadConfig = loadConfig;
exports.setConfigValue = setConfigValue;
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}
exports.ConfigError = ConfigError;
function getConfigPath() {
    return path.join(os.homedir(), '.posthog-cli', 'config.json');
}
function readConfigFile() {
    const configPath = getConfigPath();
    try {
        const content = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return {};
    }
}
function deriveIngestionHost(host) {
    // https://us.posthog.com → https://us.i.posthog.com
    // https://eu.posthog.com → https://eu.i.posthog.com
    // For self-hosted: insert .i before the TLD — best effort
    try {
        const url = new URL(host);
        const parts = url.hostname.split('.');
        if (parts.length >= 2) {
            // Insert 'i' as second segment: us.posthog.com → us.i.posthog.com
            parts.splice(1, 0, 'i');
            url.hostname = parts.join('.');
        }
        return url.toString().replace(/\/$/, '');
    }
    catch {
        return host;
    }
}
function loadConfig() {
    const fileConfig = readConfigFile();
    const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY ?? fileConfig['personalApiKey'] ?? '';
    const projectApiKey = process.env.POSTHOG_PROJECT_API_KEY ?? fileConfig['projectApiKey'] ?? '';
    const projectId = process.env.POSTHOG_PROJECT_ID ?? fileConfig['projectId'] ?? '';
    const host = (process.env.POSTHOG_HOST ?? fileConfig['host'] ?? 'https://us.posthog.com').replace(/\/$/, '');
    if (!personalApiKey) {
        throw new ConfigError('POSTHOG_PERSONAL_API_KEY is required. Set it as an environment variable or run: posthog config set personalApiKey <key>');
    }
    if (!projectId) {
        throw new ConfigError('POSTHOG_PROJECT_ID is required. Set it as an environment variable or run: posthog config set projectId <id>');
    }
    return {
        personalApiKey,
        projectApiKey,
        projectId,
        host,
        ingestionHost: deriveIngestionHost(host),
    };
}
function setConfigValue(key, value) {
    const configPath = getConfigPath();
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    let existing = {};
    try {
        const content = fs.readFileSync(configPath, 'utf-8');
        existing = JSON.parse(content);
    }
    catch {
        // file doesn't exist or is invalid — start fresh
    }
    existing[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(existing, null, 2), 'utf-8');
}
//# sourceMappingURL=config.js.map