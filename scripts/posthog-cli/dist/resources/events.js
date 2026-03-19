"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvents = listEvents;
async function listEvents(client, params = {}) {
    const { event, distinct_id, limit = 10, after, before } = params;
    return client.request(`/projects/${client.projectId}/events/`, {
        query: { event, distinct_id, limit, after, before },
    });
}
//# sourceMappingURL=events.js.map