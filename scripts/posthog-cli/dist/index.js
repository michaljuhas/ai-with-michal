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
exports.projectsResource = exports.cohortsResource = exports.annotationsResource = exports.dashboardsResource = exports.insightsResource = exports.queryResource = exports.personsResource = exports.featureFlagsResource = exports.eventsResource = exports.formatError = exports.formatOutput = exports.ApiError = exports.createClient = exports.PostHogClient = exports.ConfigError = exports.setConfigValue = exports.loadConfig = exports.program = void 0;
var cli_1 = require("./cli");
Object.defineProperty(exports, "program", { enumerable: true, get: function () { return cli_1.program; } });
var config_1 = require("./lib/config");
Object.defineProperty(exports, "loadConfig", { enumerable: true, get: function () { return config_1.loadConfig; } });
Object.defineProperty(exports, "setConfigValue", { enumerable: true, get: function () { return config_1.setConfigValue; } });
Object.defineProperty(exports, "ConfigError", { enumerable: true, get: function () { return config_1.ConfigError; } });
var client_1 = require("./lib/client");
Object.defineProperty(exports, "PostHogClient", { enumerable: true, get: function () { return client_1.PostHogClient; } });
Object.defineProperty(exports, "createClient", { enumerable: true, get: function () { return client_1.createClient; } });
Object.defineProperty(exports, "ApiError", { enumerable: true, get: function () { return client_1.ApiError; } });
var output_1 = require("./lib/output");
Object.defineProperty(exports, "formatOutput", { enumerable: true, get: function () { return output_1.formatOutput; } });
var errors_1 = require("./lib/errors");
Object.defineProperty(exports, "formatError", { enumerable: true, get: function () { return errors_1.formatError; } });
exports.eventsResource = __importStar(require("./resources/events"));
exports.featureFlagsResource = __importStar(require("./resources/feature-flags"));
exports.personsResource = __importStar(require("./resources/persons"));
exports.queryResource = __importStar(require("./resources/query"));
exports.insightsResource = __importStar(require("./resources/insights"));
exports.dashboardsResource = __importStar(require("./resources/dashboards"));
exports.annotationsResource = __importStar(require("./resources/annotations"));
exports.cohortsResource = __importStar(require("./resources/cohorts"));
exports.projectsResource = __importStar(require("./resources/projects"));
// Run CLI when executed directly
if (require.main === module) {
    const { program: cli } = require('./cli');
    cli.parseAsync(process.argv).catch((err) => {
        const { formatError: fe } = require('./lib/errors');
        console.error(fe(err));
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map