import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBStwmLrCCc0LwOuerYqbmweJQ87QGEz8c",
  authDomain: "lms-ff.firebaseapp.com",
  projectId: "lms-ff",
  storageBucket: "lms-ff.firebasestorage.app",
  messagingSenderId: "345465521320",
  appId: "1:345465521320:web:1f7d49ff10c99f3efdee9d",
  measurementId: "G-ZDTQZE1DY5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Add reCAPTCHA verification
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}