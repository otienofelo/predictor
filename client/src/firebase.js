// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setDoc,doc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC1xbZ5eq-xA67EUNw0kMIkuqSJzhiAg4",
  authDomain: "livestock-managment-syst-12651.firebaseapp.com",
  projectId: "livestock-managment-syst-12651",
  storageBucket: "livestock-managment-syst-12651.firebasestorage.app",
  messagingSenderId: "451430855454",
  appId: "1:451430855454:web:11fdf409368fa301e94f0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;