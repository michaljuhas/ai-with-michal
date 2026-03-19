"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
const stripe_1 = __importDefault(require("stripe"));
function createClient(apiKey, options) {
    return new stripe_1.default(apiKey, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
    });
}
//# sourceMappingURL=client.js.map