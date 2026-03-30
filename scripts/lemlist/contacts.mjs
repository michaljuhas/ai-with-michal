/**
 * Create or update a contact (upsert).
 * At least one of: email, linkedinUrl, linkedinUrlSalesNav is required.
 *
 * @param {object} client - Lemlist API client
 * @param {object} contactData - { email, linkedinUrl, firstName, lastName, companyName, jobTitle, companyId, companyDomain, ... }
 * @returns {Promise<object>} Contact object; includes `created: true` on 201, `created: false` on 200
 */
export async function upsertContact(client, contactData) {
  return client.request({
    method: 'POST',
    path: '/contacts',
    body: contactData,
  });
}

/**
 * List contacts.
 *
 * @param {object} client - Lemlist API client
 * @param {object} [query={}] - { offset, limit } and any filter fields
 * @returns {Promise<object>}
 */
export async function listContacts(client, query = {}) {
  return client.request({
    method: 'GET',
    path: '/contacts',
    query,
  });
}

/**
 * Get a single contact by ID.
 *
 * @param {object} client - Lemlist API client
 * @param {string} contactId
 * @returns {Promise<object>}
 */
export async function getContact(client, contactId) {
  return client.request({
    method: 'GET',
    path: `/contacts/${contactId}`,
  });
}
