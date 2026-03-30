export async function listSchedules(client) {
  return client.request({
    method: 'GET',
    path: '/schedules',
    apiVersion: 'default',
  });
}

export async function getSchedule(client, scheduleId) {
  return client.request({
    method: 'GET',
    path: `/schedules/${scheduleId}`,
    apiVersion: 'default',
  });
}

export async function createSchedule(client, scheduleData) {
  return client.request({
    method: 'POST',
    path: '/schedules',
    body: scheduleData,
    apiVersion: 'default',
  });
}

export async function updateSchedule(client, scheduleId, updates) {
  return client.request({
    method: 'PATCH',
    path: `/schedules/${scheduleId}`,
    body: updates,
    apiVersion: 'default',
  });
}

export async function deleteSchedule(client, scheduleId) {
  return client.request({
    method: 'DELETE',
    path: `/schedules/${scheduleId}`,
    apiVersion: 'default',
  });
}
