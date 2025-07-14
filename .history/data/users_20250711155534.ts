/**
 * This file contains user credentials and roles used in tests. It centralizes user data, enabling easy maintenance and reuse.
 * 
 * - default: The default user credentials for basic login scenarios,
 *   which can be overridden by environment variables for flexibility.
 * - existingUser: A known existing user email, for scenarios like invitations.
 * - roles: A collection of alternative user roles with their respective
 *   credentials (email and password), used to simulate different permissions
 *   and access levels during testing.
 * 
 * Usage:
 * Import this module to access user credentials by role or for general login, keeping credentials consistent and manageable across tests.
 */

export const users = {
  default: {
    email: process.env.INVENIO_USER_EMAIL || 'petr.brablc@gmail.com',
    password: process.env.INVENIO_USER_PASSWORD || '123456',
  },

  existingUser: {
    email: 'petr.brablc@cesnet.cz',
  },

  roles: {
    curator: { email: 'petr.brablc@cesnet.cz', password: '123456' },
    owner: { email: 'petr.brablc@cesnet.cz', password: '123456' },
    owner2: { email: 'petr.brablc@gmail.com', password: '123456' },
    reader: { email: 'petr.brablc@cesnet.cz', password: '123456' },
    manager: { email: 'petr.brablc@cesnet.cz', password: '123456' },
  },
};