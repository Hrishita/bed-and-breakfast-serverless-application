// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtAKuBVnpAwVZvs3kVGFlkKqLZeS3yu7E",
  authDomain: "csci5410-group23.firebaseapp.com",
  projectId: "csci5410-group23",
  storageBucket: "csci5410-group23.appspot.com",
  messagingSenderId: "169417099966",
  appId: "1:169417099966:web:e87e497cf27656ae6bacef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

// Add the public key generated from the console here.
// const publicKey = "BP5v3zguROrGRxFNWdfaeJF_-Pvbnmzx4gjfouLouJrqnVPG0_YdFO-oEwX2wsp6rrJVLxsT6r6h1GBoGxpp24M";
// messaging.getToken({vapidKey: publicKey}).then((currentToken) => {
//   if (currentToken) {
//     console.log(currentToken);
//   } else {
//     console.log('No Instance ID token available. Request permission to generate one.');
//   }
// }).catch((err) => {
//   console.error(err);
// });

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // ...
});


// 
// Import the functions you need from the SDKs you need
// import firebase from "firebase/app";
// // eslint-disable-next-line
// import _messaging from "firebase/messaging";
// import firebaseConfig from "./firebaseConfig";

// // BEVS62DDWHlM1zO4T3E0FTArWWmxMP024maYCkL1_0aaT6zxdyZEiUoI2yACApCgz0HjnOufYbxFi84fE9NOUns
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// const app = firebase.initializeApp(firebaseConfig);
// export const fMessaging = app.messaging();

// const analytics = getAnalytics(app);
// const messaging = getMessaging(app)

// export const getMessagingToken = (setTokenFound) => {
//     return getToken(messaging, {vapidKey: 'GENERATED_MESSAGING_KEY'}).then((currentToken) => {
//       if (currentToken) {
//         console.log('current token for client: ', currentToken);
//         setTokenFound(true);
//         // Track the token -> client mapping, by sending to backend server
//         // show on the UI that permission is secured
//       } else {
//         console.log('No registration token available. Request permission to generate one.');
//         setTokenFound(false);
//         // shows on the UI that permission is required 
//       }
//     }).catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//       // catch error while creating client token
//     });
//   }

//   export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
// });

// export const subscribeToTopic = (topic) => {
//   app.messaging().
//     subscribeToTopic(topic).then(() => {
//       console.log('Subscribed to topic: ', topic);
//     }).catch((err) => {
//       console.log('Error subscribing to topic: ', err);
//     })
// }