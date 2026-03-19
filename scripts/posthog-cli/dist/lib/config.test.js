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
const vitest_1 = require("vitest");
const fs = __importStar(require("fs"));
vitest_1.vi.mock('fs');
vitest_1.vi.mock('os', () => ({ homedir: vitest_1.vi.fn(() => '/mock/home') }));
(0, vitest_1.describe)('config', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetModules();
        vitest_1.vi.clearAllMocks();
        vitest_1.vi.mocked(fs.readFileSync).mockImplementation(() => { throw Object.assign(new Error(), { code: 'ENOENT' }); });
        vitest_1.vi.mocked(fs.existsSync).mockReturnValue(false);
    });
    (0, vitest_1.afterEach)(() => { vitest_1.vi.unstubAllEnvs(); });
    (0, vitest_1.it)('loads config from env vars', async () => {
        vitest_1.vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
        vitest_1.vi.stubEnv('POSTHOG_PROJECT_ID', '42');
        vitest_1.vi.stubEnv('POSTHOG_HOST', 'https://us.posthog.com');
        const { loadConfig } = await Promise.resolve().then(() => __importStar(require('./config')));
        const cfg = loadConfig();
        (0, vitest_1.expect)(cfg.personalApiKey).toBe('phx_test');
        (0, vitest_1.expect)(cfg.projectId).toBe('42');
        (0, vitest_1.expect)(cfg.host).toBe('https://us.posthog.com');
    });
    (0, vitest_1.it)('strips trailing slash from host', async () => {
        vitest_1.vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
        vitest_1.vi.stubEnv('POSTHOG_PROJECT_ID', '42');
        vitest_1.vi.stubEnv('POSTHOG_HOST', 'https://us.posthog.com/');
        const { loadConfig } = await Promise.resolve().then(() => __importStar(require('./config')));
        (0, vitest_1.expect)(loadConfig().host).toBe('https://us.posthog.com');
    });
    (0, vitest_1.it)('throws when personalApiKey is missing', async () => {
        vitest_1.vi.stubEnv('POSTHOG_PERSONAL_API_KEY', '');
        vitest_1.vi.stubEnv('POSTHOG_PROJECT_ID', '42');
        const { loadConfig, ConfigError } = await Promise.resolve().then(() => __importStar(require('./config')));
        (0, vitest_1.expect)(() => loadConfig()).toThrow(ConfigError);
        (0, vitest_1.expect)(() => loadConfig()).toThrow('POSTHOG_PERSONAL_API_KEY');
    });
    (0, vitest_1.it)('throws when projectId is missing', async () => {
        vitest_1.vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
        vitest_1.vi.stubEnv('POSTHOG_PROJECT_ID', '');
        const { loadConfig, ConfigError } = await Promise.resolve().then(() => __importStar(require('./config')));
        (0, vitest_1.expect)(() => loadConfig()).toThrow(ConfigError);
        (0, vitest_1.expect)(() => loadConfig()).toThrow('POSTHOG_PROJECT_ID');
    });
    (0, vitest_1.it)('falls back to config file values', async () => {
        vitest_1.vi.stubEnv('POSTHOG_PERSONAL_API_KEY', '');
        vitest_1.vi.stubEnv('POSTHOG_PROJECT_ID', '');
        vitest_1.vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ personalApiKey: 'phx_file', projectId: '99' }));
        const { loadConfig } = await Promise.resolve().then(() => __importStar(require('./config')));
        const cfg = loadConfig();
        (0, vitest_1.expect)(cfg.personalApiKey).toBe('phx_file');
        (0, vitest_1.expect)(cfg.projectId).toBe('99');
    });
    (0, vitest_1.it)('uses default host when not set', async () => {
        vitest_1.vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
        vitest_1.vi.stubEnv('POSTHOG_PROJECT_ID', '42');
        vitest_1.vi.stubEnv('POSTHOG_HOST', '');
        const { loadConfig } = await Promise.resolve().then(() => __importStar(require('./config')));
        (0, vitest_1.expect)(loadConfig().host).toBe('https://us.posthog.com');
    });
    (0, vitest_1.it)('setConfigValue writes new key to file', async () => {
        vitest_1.vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
        const writeSpy = vitest_1.vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
        const { setConfigValue } = await Promise.resolve().then(() => __importStar(require('./config')));
        setConfigValue('personalApiKey', 'phx_new');
        const written = writeSpy.mock.calls[0]?.[1];
        (0, vitest_1.expect)(JSON.parse(written).personalApiKey).toBe('phx_new');
    });
    (0, vitest_1.it)('setConfigValue merges with existing file', async () => {
        vitest_1.vi.mocked(fs.existsSync).mockReturnValue(true);
        vitest_1.vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({ projectId: '10' }));
        const writeSpy = vitest_1.vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
        const { setConfigValue } = await Promise.resolve().then(() => __importStar(require('./config')));
        setConfigValue('personalApiKey', 'phx_merged');
        const written = writeSpy.mock.calls[0]?.[1];
        const parsed = JSON.parse(written);
        (0, vitest_1.expect)(parsed.personalApiKey).toBe('phx_merged');
        (0, vitest_1.expect)(parsed.projectId).toBe('10');
    });
    (0, vitest_1.it)('getConfigPath is under home dir', async () => {
        const { getConfigPath } = await Promise.resolve().then(() => __importStar(require('./config')));
        (0, vitest_1.expect)(getConfigPath()).toContain('.posthog-cli');
        (0, vitest_1.expect)(getConfigPath()).toContain('config.json');
    });
});
//# sourceMappingURL=config.test.js.map