// List all unsubscribed variables (v2)
// query: { offset, limit }
export async function listUnsubscribes(client, query = {}) {
  return client.request({
    method: 'GET',
    path: '/v2/unsubscribes/variables',
    query,
    apiVersion: 'v2-path',
  });
}

// Add a value to unsubscribe list (email, domain, LinkedIn URL, or phone)
// Idempotent — returns existing record if already unsubscribed
export async function addUnsubscribe(client, value) {
  return client.request({
    method: 'POST',
    path: `/v2/unsubscribes/variables/${value}`,
    apiVersion: 'v2-path',
  });
}

// Remove a value from unsubscribe list (re-subscribe)
export async function removeUnsubscribe(client, value) {
  return client.request({
    method: 'DELETE',
    path: `/v2/unsubscribes/variables/${value}`,
    apiVersion: 'v2-path',
  });
}
