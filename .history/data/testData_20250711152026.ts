import { faker } from '@faker-js/faker';
import { users } from './users';
import { uploadData } from './uploadData';
import { exportData } from './exportData';
import { getDatePlusOne, getTodayDate } from './dateUtils';

/**
 * testData.ts
 * 
 * Central entry point for test-related data, including:
 * - Generated emails/passwords
 * - User credentials (imported from users.ts)
 * - Upload data (imported from uploadData.ts)
 * - Export data (imported from exportData.ts)
 * - Date utilities (from dateUtils.ts)
 */

export const testData = {
  // Static login for default user (used if no role or strategy is applied)
  email: users.default.email,
  password: users.default.password,

  // Faker-generated dynamic credentials
  randomEmail: () => faker.internet.email(),
  randomPassword: () => faker.internet.password(),

  // Existing known user (e.g., for invitations)
  existingUserEmail: users.existingUser.email,

  // All alternative user roles (owner, curator, etc.)
  alternativeUsers: users.roles,

  // Dynamically resolve user credentials by role
  getCredentials: (role: keyof typeof users.roles | symbol) => {
    const roleKey = typeof role === 'symbol' ? String(role) : role;
    const user = users.roles[roleKey as keyof typeof users.roles];
    if (!user) {
      throw new Error(`No credentials found for role: ${roleKey}`);
    }
    return user;
  },

  // Random reason generator (e.g., for embargo)
  randomEmbargoReason: () => faker.lorem.sentence(),

  // Upload test data module
  upload: uploadData,

  // Export test data module
  export: exportData,

  // Date utilities
  getDatePlusOne,
  getTodayDate,
};