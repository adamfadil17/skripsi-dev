// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'learnfrom-8ef9e.firebaseapp.com',
  projectId: 'learnfrom-8ef9e',
  storageBucket: 'learnfrom-8ef9e.appspot.com',
  messagingSenderId: '657828837489',
  appId: '1:657828837489:web:e3c71476e6b52d6afac3d0',
  measurementId: 'G-G8NNC3QFYD',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
