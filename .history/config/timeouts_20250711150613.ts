export const timeouts = {
  testTimeout: Number(process.env.TEST_TIMEOUT) || 120_000,
  actionTimeout: Number(process.env.ACTION_TIMEOUT) || 5_000,
  navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 10_000,
};