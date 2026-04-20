const config = {
  baseApiMasters: process.env.REACT_APP_API_MASTERS,
  baseApiExpense: process.env.REACT_APP_API_EXPENSE,
  baseApiAuth: process.env.REACT_APP_API_AUTH,
  baseApiAdmission: process.env.REACT_APP_API_ADMISSION,
  baseApiIncome: process.env.REACT_APP_API_INCOME,
  baseApiStudent: process.env.REACT_APP_API_STUDENT,
  baseApiApplication: process.env.REACT_APP_API_APPLICATION,
  baseApiBatch: process.env.REACT_APP_API_BATCH,
  baseApiCRMGetCounsellor: process.env.REACT_APP_CRM_GET_COUNSELLOR_API_URL,
  baseErpStudentPortal: process.env.REACT_APP_ERP_STUDENT_PORTAL,
  baseApiLabMasters: process.env.REACT_APP_API_LAB_MASTERS,
  baseApiSystemTracker: process.env.REACT_APP_API_SYSTEM_TRACKER,
  baseApiCRMGet: process.env.REACT_APP_CRM_GET_LEAD_URL,
  baseApiCRMAutoUpdate: process.env.REACT_APP_CRM_AUTO_UPDATE_LEAD_URL,
  mode: process.env.REACT_APP_MODE,
  aws: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_USERPOOLID,
    userPoolWebClientId: process.env.REACT_APP_AWS_APP_CLIENT_ID,
    cookieDomain: process.env.REACT_APP_AUTH_COOKIE_DOMAIN,
  },
  bucket_name: `https://${process.env.REACT_APP_NEXT_PUBLIC_s3_public_bucket}.s3.amazonaws.com`,
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
  placementURL: process.env.REACT_APP_PLACEMENT_URL || '/' ,
};

export default config;
