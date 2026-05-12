import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCGLivjp_rTQIXTQugYhzriMHsTLOEZLHw",
  authDomain: "ecommerce-app-fa0df.firebaseapp.com",
  projectId: "ecommerce-app-fa0df",
  storageBucket: "ecommerce-app-fa0df.firebasestorage.app",
  messagingSenderId: "271602775252",
  appId: "1:271602775252:web:49f13a9e1d500b9ac8f741"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);