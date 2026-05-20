import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const CREDENTIALS_PATH = path.join(process.cwd(), 'config', 'admin-credentials.json');
const STORAGE_OUT = path.join(process.cwd(), 'auth', 'admin-storage.json');

test('save admin auth storage', async ({ page }) => {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Credentials file not found at ${CREDENTIALS_PATH}`);
  }

  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));

  await page.goto('https://www.saucedemo.com');
  await page.fill('[data-test="username"]', creds.username);
  await page.fill('[data-test="password"]', creds.password);
  await page.click('[data-test="login-button"]');
  await page.waitForURL(/.*inventory/);

  // Ensure output directory exists
  const outDir = path.dirname(STORAGE_OUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await page.context().storageState({ path: STORAGE_OUT });
});
