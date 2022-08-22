
import {initializeApp} from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDuw7GJq0PPdl6-WgXavSmCfYeX1PyTq6Q",
    authDomain: "serverless-2-352903.fircdebaseapp.com",
    projectId: "serverless-2-352903",
    storageBucket: "serverless-2-352903.appspot.com",
    messagingSenderId: "666845719337",
    appId: "1:666845719337:web:f8ca55f4c9bebbac49a538",
    measurementId: "G-59PJVEV3EV"
};
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)