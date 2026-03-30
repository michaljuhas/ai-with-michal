export async function getTeam(client) {
  return client.request({
    method: 'GET',
    path: '/team',
    apiVersion: 'default',
  });
}

export async function getTeamCredits(client) {
  return client.request({
    method: 'GET',
    path: '/team/credits',
    apiVersion: 'default',
  });
}

export async function getTeamSenders(client) {
  return client.request({
    method: 'GET',
    path: '/team/senders',
    apiVersion: 'default',
  });
}
