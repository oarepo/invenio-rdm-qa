import { faker } from '@faker-js/faker';

/**
 * This file contains test data specific for upload functionality.
 * 
 * It provides dynamically generated values (using Faker library) to be used when testing upload of records, communities, and related data fields in the application.
 * 
 * Includes:
 * - Generators for random texts for record titles, descriptions, community names, etc.
 * - A resourceType selector from a predefined list, optionally excluding the currently selected type to avoid duplicates.
 * 
 * Usage:
 * Import this module in tests that involve uploading data and use its methods to obtain unique and realistic test values.
 */

export const uploadData = {
  recordTitle: () => faker.lorem.sentence(),
  familyName: () => faker.lorem.word(),
  recordDescription: () => faker.lorem.paragraph(),
  communityName: () => faker.lorem.word(),
  communityIdentifier: () => faker.lorem.word(),

  resourceType: (currentlySelected: string | null = null): string => {
    const resourceTypes = [
      'Image', 'Video', 'Dataset', 'Other',
      'Audio', 'Software', 'Workflow',
      'Poster', 'Model', 'Lesson', 'Event'
    ];

    const availableTypes = currentlySelected
      ? resourceTypes.filter(type => type !== currentlySelected)
      : resourceTypes;

    return faker.helpers.arrayElement(availableTypes);
  },
};