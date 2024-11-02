// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEY-mmG91duXhRB7PGnnaTDRq7dZl21Tw",
  authDomain: "login-9e5e4.firebaseapp.com",
  projectId: "login-9e5e4",
  storageBucket: "login-9e5e4.appspot.com",
  messagingSenderId: "584450460957",
  appId: "1:584450460957:web:6d111bd5a251dbddd765f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app)
export default app;