export const users = {
  default: {
    email: process.env.INVENIO_USER_EMAIL || 'petr.brablc@gmail.com',
    password: process.env.INVENIO_USER_PASSWORD || '123456',
  },

  existingUser: {
    email: 'petr.brablc@cesnet.cz',
  },

  roles: {
    curator: { email: 'petr.brablc@cesnet.cz', password: '123456' },
    owner: { email: 'petr.brablc@cesnet.cz', password: '123456' },
    owner2: { email: 'petr.brablc@gmail.com', password: '123456' },
    reader: { email: 'petr.brablc@cesnet.cz', password: '123456' },
    manager: { email: 'petr.brablc@cesnet.cz', password: '123456' },
  },
};