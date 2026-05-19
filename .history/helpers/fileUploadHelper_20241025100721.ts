import { Page } from '@playwright/test';
import * as fs from 'fs'; // A Node.js module for working with files and directories (reading, writing, deleting files, etc.).
import * as path from 'path'; // A Node.js module for working with file and directory paths, allowing dynamic and absolute path creation.

// Helper provides utility methods for uploading files during tests

export class FileUploadHelper {
  private uploadFolderPath: string;

  constructor(private page: Page) {
    // Define the path for the UploadFiles folder inside the 'data' directory dynamically
    this.uploadFolderPath = path.resolve(process.cwd(), 'data/UploadFiles');

    // Ensure the UploadFiles directory exists
    this.ensureUploadFolderExists();
  }

  // Ensure the UploadFiles directory exists
  private ensureUploadFolderExists() {
    if (!fs.existsSync(this.uploadFolderPath)) {
      fs.mkdirSync(this.uploadFolderPath, { recursive: true }); // Create the folder if it doesn't exist
    }
  }

  // Upload a random file from the UploadFiles folder
  async uploadRandomFile() {
    const files = fs.readdirSync(this.uploadFolderPath); // Read files in the folder

    if (files.length === 0) {
      throw new Error('No files available in the UploadFiles directory.');
    }

    // Select a random file and upload
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.join(this.uploadFolderPath, randomFile);
    await this.page.setInputFiles('input[type="file"]', filePath); // Upload the selected file

    // Log file upload for debugging purposes
    console.log(`Uploading file: ${filePath}`);
  }
}