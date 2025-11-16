// Firebase Configuration for TraceHerbs
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Optional: Analytics (you can enable this later)
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT2Uer4YSK_EN09hsOQFHKABARmjAEKvA",
  authDomain: "traceherb-a0011.firebaseapp.com",
  projectId: "traceherb-a0011",
  storageBucket: "traceherb-a0011.firebasestorage.app",
  messagingSenderId: "649128778184",
  appId: "1:649128778184:web:1f84720eb993b6f1c488fd",
  measurementId: "G-8DEJNYLGKX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services for TraceHerbs
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: Initialize Analytics
// const analytics = getAnalytics(app);

// Development mode emulator connection (optional)
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // Emulators already connected
  }
}

export default app;