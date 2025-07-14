/**
 * Centralized configuration for various timeout values used across tests. Timeouts can be overridden by environment variables for flexibility in different environments (local, CI, etc.).
 * 
 * Properties:
 * - testTimeout: Maximum time allowed for a single test to run (in ms).
 * - actionTimeout: Timeout for individual user actions like clicks or typing (in ms).
 * - navigationTimeout: Timeout for page navigation and loading (in ms).
 * 
 * This setup ensures consistent timeout management and easy adjustments without modifying test logic.
 */

export const timeouts = {
  testTimeout: Number(process.env.TEST_TIMEOUT) || 120_000,
  actionTimeout: Number(process.env.ACTION_TIMEOUT) || 5_000,
  navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 10_000,
};