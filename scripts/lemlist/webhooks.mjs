export async function listWebhooks(client) {
  return client.request({
    method: 'GET',
    path: '/hooks',
    apiVersion: 'default',
  });
}

export async function createWebhook(client, targetUrl, type) {
  const body = { targetUrl };
  if (type !== undefined) {
    body.type = type;
  }
  return client.request({
    method: 'POST',
    path: '/hooks',
    body,
    apiVersion: 'default',
  });
}

export async function deleteWebhook(client, hookId) {
  return client.request({
    method: 'DELETE',
    path: `/hooks/${hookId}`,
    apiVersion: 'default',
  });
}
