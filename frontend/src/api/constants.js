
const CONSTANTS = Object.freeze({
  API_ENDPOINT: '',
  LOCAL_BACKEND_URL: ``,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN,
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  PRODUCTION_URL: '',
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MSG_SENDER_ID: process.env.FIREBASE_MSG_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  AXIOS_CUSTOMER_ID:'https://j6b9jnqtj4.execute-api.us-east-1.amazonaws.com/1/',
  AXIOS_CUSTOMER:'https://q4clw3t4cc.execute-api.us-east-1.amazonaws.com/1',
  AXIOS_CAESER:'https://us-central1-serverless-2-352903.cloudfunctions.net/caeser?',
  AXIOS_HOTEL:'https://hm39jw0s6d.execute-api.us-east-1.amazonaws.com/hotel',
});

export default CONSTANTS;
