import { test, expect } from '../../fixtures/fixtures'; // test, expect – Importuje testovací funkce z vlastních fixtures
import { UploadPage } from '../../pages/newUploadPage'; // Importuje page object model (POM) pro stránku nahrávání (UploadPage). Ten obsahuje metody pro interakci s UI na této stránce.
import { testData } from '../../data/testData'; // Importuje testovací data, která se pravděpodobně používají k vyplnění formulářů.
import { qase } from 'playwright-qase-reporter'; //  Importuje integraci s Qase. Umožňuje propojit test s testovacím scénářem v Qase.

test.describe('Records', () => { // test.describe seskupuje testy týkající se "Records" 
  let uploadPage: UploadPage; // uploadPage – Instance třídy UploadPage, která bude použita pro testovací interakce.
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    await uploadPage.navigateToUploadSection(); // Navigate to the upload section
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-58
  test(qase(58, 'New Upload'), async () => {  

    // Fill in the record details
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true); // Adjust this based on your test needs
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Click the 'Publish' button
    await uploadPage.clickPublish();

    // Click the 'Publish' button on the confirmation dialog
    await uploadPage.clickPublishOnConfirmation();
    await uploadPage.waitForTwoSeconds();

    // Check the title of the new created record in the detail
    const recordExists = await uploadPage.checkRecordExists();
    expect(recordExists).toBe(true); // Assert that the record exists
  });
});
