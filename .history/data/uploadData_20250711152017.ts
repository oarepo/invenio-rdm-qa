import { faker } from '@faker-js/faker';

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