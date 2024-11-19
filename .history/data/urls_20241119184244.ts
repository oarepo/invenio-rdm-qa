// Direct URLS for a quick navigation
const baseURL = process.env.INVENIO_BASE_URL ? process.env.INVENIO_BASE_URL : 'https://inveniordm.web.cern.ch/' //'https://127.0.0.1:5000/'

export const urls = {
    baseURL,
    profileURL: `${baseURL}account/settings/profile`,
    newUploadURL: `${baseURL}uploads/new`,
    myDashboardURL: `${baseURL}me/uploads`,
    communitiesURL: `${baseURL}communities`,
    newCommunityURL: `${baseURL}communities/new`
  };