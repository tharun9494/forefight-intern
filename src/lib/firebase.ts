import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAXYP1zsyMy43uX4rcMfRzV-Ad46qmXBm0",
  authDomain:"lms-portal-f460e.firebaseapp.com",
  databaseURL: "https://lms-portal-f460e-default-rtdb.firebaseio.com",
  projectId: "lms-portal-f460e",
  storageBucket: "lms-portal-f460e.firebasestorage.app",
  messagingSenderId: "222078048395",
  appId: "1:222078048395:web:1698c2a82db9bfdcf29c8e"
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