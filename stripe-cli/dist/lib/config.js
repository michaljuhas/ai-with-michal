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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigError = void 0;
exports.getApiKey = getApiKey;
exports.isLiveMode = isLiveMode;
exports.validateApiKey = validateApiKey;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const toml = __importStar(require("@iarna/toml"));
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}
exports.ConfigError = ConfigError;
const CONFIG_PATH = path_1.default.join(os_1.default.homedir(), '.stripe-cli-wrapper', 'config.toml');
function getApiKey() {
    if (process.env.STRIPE_API_KEY) {
        return process.env.STRIPE_API_KEY;
    }
    if (fs_1.default.existsSync(CONFIG_PATH)) {
        const content = fs_1.default.readFileSync(CONFIG_PATH, 'utf-8');
        const parsed = toml.parse(content);
        if (parsed.stripe?.api_key) {
            return parsed.stripe.api_key;
        }
    }
    throw new ConfigError('No Stripe API key found. Set STRIPE_API_KEY env var or add to ~/.stripe-cli-wrapper/config.toml');
}
function isLiveMode(flag) {
    return flag;
}
function validateApiKey(key) {
    if (!key.startsWith('sk_test_') && !key.startsWith('sk_live_')) {
        throw new ConfigError(`Invalid API key format. Key must start with sk_test_ or sk_live_. Got: ${key.substring(0, 10)}...`);
    }
}
//# sourceMappingURL=config.js.map