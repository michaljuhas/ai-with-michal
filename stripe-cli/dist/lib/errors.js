"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = formatError;
function isStripeErrorLike(err) {
    return (typeof err === 'object' &&
        err !== null &&
        ('type' in err || 'code' in err) &&
        'message' in err);
}
function formatError(err) {
    if (isStripeErrorLike(err)) {
        const parts = ['[ERROR]'];
        const e = err;
        if (e.type)
            parts.push(`type=${e.type}`);
        if (e.code)
            parts.push(`code=${e.code}`);
        if (e.message)
            parts.push(`message=${e.message}`);
        if (e.param)
            parts.push(`param=${e.param}`);
        if (e.decline_code)
            parts.push(`decline_code=${e.decline_code}`);
        return parts.join(' ');
    }
    if (err instanceof Error) {
        return `[ERROR] ${err.message}`;
    }
    if (typeof err === 'string') {
        return `[ERROR] ${err}`;
    }
    return `[ERROR] ${JSON.stringify(err)}`;
}
//# sourceMappingURL=errors.js.map