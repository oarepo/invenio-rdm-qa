import * as dotenv from 'dotenv';
import path from 'path';

// Načti správný .env soubor podle NODE_ENV
const ENV = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `../.env.${ENV}`) });

export const appConfig = {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  qaseToken: process.env.QASE_TESTOPS_API_TOKEN || '',
  qaseProject: process.env.QASE_TESTOPS_PROJECT || '',
  qaseEnvironment: process.env.QASE_ENVIRONMENT || 'development',
};