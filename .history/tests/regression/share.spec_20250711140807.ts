import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;

  test.beforeEach(async ({ loggedInPage, uploadFileForm }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-23
  test(qase(23, 'Share'), async () => {  

    // Click the 'Share' button
    await uploadPage.clickShare();

    // Click the 'Add people' button
    await uploadPage.clickAddPeopleButton();

    // Add a user (fill in 'User' field)
    await uploadPage.fillUser();

    // Verify if the user was added
    const isPresent = await uploadPage.verifyAddedUserForShare();
    expect(isPresent).toBe(true);

    // Select 'Can edit' radio button ('Access' section - 3 = 'Can edit' radio button,)
    await uploadPage.clickAddPeopleHeader();
    await uploadPage.clickCanEditRadioButton(3);

    // Click the 'Add' button
    await uploadPage.clickAddButton();

    // Verify if the user was added (is present in list - 'Share access' pop-up dialog)
    const isCanEditPresent = await uploadPage.isCanEditElementPresent();
    expect(isCanEditPresent).toBe(true); 
  });
});