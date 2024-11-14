// Direct URLS for a quick navigation
const baseURL = process.env.INVENIO_BASE_URL? process.env.INVENIO_BASE_URL : 'https://inveniordm.web.cern.ch/'

export const urls = {
    baseURL,
    profileURL: 'https://inveniordm.web.cern.ch/account/settings/profile',
    newUploadURL: 'https://inveniordm.web.cern.ch/uploads/new',
    myDashboardURL: 'https://inveniordm.web.cern.ch/me/uploads',
    communitiesURL: 'https://inveniordm.web.cern.ch/communities',
    newCommunityURL: 'https://inveniordm.web.cern.ch/communities/new'
  };