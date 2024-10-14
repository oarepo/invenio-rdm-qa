import { test, expect, chromium } from '@playwright/test';

test('test', async () => {
  // Launch Chromium, but force it to use the Google Chrome executable
  const browser = await chromium.launch({
    headless: false,  // Disable headless mode to visually see the browser
    channel: 'chrome',  // This tells Playwright to use Google Chrome instead of Chromium
  });

  // Set up a new context, including a fixed viewport size
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, // Set a desktop resolution
    userAgent: 'your-chrome-user-agent-here', // Optional: use Chrome's exact user agent
  });

  const page = await context.newPage();

  // Navigate to Invenio RDM login page
  await page.goto('https://inveniordm.web.cern.ch/');
  
  // Perform login steps
  await page.getByRole('link', { name: ' Log in' }).click();
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('petr.brablc@gmail.com');
  await page.getByPlaceholder('Email Address').press('Tab');
  await page.getByPlaceholder('Password').fill('D@rgor23x');
  await page.getByRole('button', { name: 'Log in' }).click();

    await page.goto('https://inveniordm.web.cern.ch/uploads/new');
    await page.getByText('No', { exact: true }).first().click();
    await page.getByRole('button', { name: 'Get a DOI now!' }).click();
    await page.click('#rdm-deposit-form .required.field.invenio-select-field > div');
    await page.getByRole('option', { name: 'Image', exact: true }).click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('TestName');
    await page.getByLabel('Title').press('Enter');
    await page.getByRole('button', { name: 'Add creator' }).click();
    await page.getByPlaceholder('Family name').click();
    await page.getByPlaceholder('Family name').fill('Creator');
    await page.getByPlaceholder('Family name').press('Enter');
    await page.click('body > div.ui.top.aligned.page.modals.dimmer.transition.visible.active > div > div.actions > button:nth-child(3)');
   // await page.getByRole('button', { name: 'Upload files', exact: true }).click();
   const filePath = '/Users/petrbrablc/Desktop/RDM/data/UploadFiles/Anon.jpg'; // Update with your file path
   await page.setInputFiles('input[type="file"]', filePath);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.getByRole('button', { name: 'Publish' }).nth(1).click();

  // Close the browser after the test
  await browser.close();
});