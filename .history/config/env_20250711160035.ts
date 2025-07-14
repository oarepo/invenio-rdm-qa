import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Responsible for loading environment variables from the correct `.env` file based on the current environment (e.g., dev, test, prod).
 * Uses the `dotenv` package to read variables from files like `.env.dev`.
 * 
 * Exports a central configuration object `appConfig` with commonly used settings such as baseURL and QASE integration tokens.
 * 
 * This approach centralizes environment-specific configuration and keeps sensitive values outside of the codebase.
 */

// Načti správný .env soubor podle NODE_ENV
const ENV = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `../.env.${ENV}`) });

export const appConfig = {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  qaseToken: process.env.QASE_TESTOPS_API_TOKEN || '',
  qaseProject: process.env.QASE_TESTOPS_PROJECT || '',
  qaseEnvironment: process.env.QASE_ENVIRONMENT || 'development',
};