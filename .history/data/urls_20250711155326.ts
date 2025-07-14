/**
 * This file defines the main URLs used throughout the tests, allowing quick navigation and centralized management of endpoints.
 * 
 * - baseURL: The base URL for the application under test, configurable via environment variable.
 * - profileURL: URL to the user profile settings page.
 * - newUploadURL: URL for creating a new upload.
 * - myDashboardURL: URL to the user's dashboard showing uploads.
 * - communitiesURL: URL listing all communities.
 * - newCommunityURL: URL for creating a new community.
 * 
 * Usage:
 * Import this module in tests or page objects to reference URLs consistently,
 * and easily switch base URLs for different environments (dev, test, prod).
 */

// Direct URLS for a quick navigation
const baseURL = process.env.INVENIO_BASE_URL ? process.env.INVENIO_BASE_URL : 'https://inveniordm.web.cern.ch/'
//'https://127.0.0.1:5000/'

export const urls = {
    baseURL,
    profileURL: `${baseURL}account/settings/profile`,
    newUploadURL: `${baseURL}uploads/new`,
    myDashboardURL: `${baseURL}me/uploads`,
    communitiesURL: `${baseURL}communities`,
    newCommunityURL: `${baseURL}communities/new`
  };