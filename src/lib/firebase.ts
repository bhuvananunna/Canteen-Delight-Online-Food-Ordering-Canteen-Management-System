import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVUbT0btIEFB86VwL1S-ZqpnCiJZP3IGM",
  authDomain: "food-order-1-79b01.firebaseapp.com",
  projectId: "food-order-1-79b01",
  storageBucket: "food-order-1-79b01.firebasestorage.app",
  messagingSenderId: "216267089644",
  appId: "1:216267089644:web:13b6412a2cf34558b6a7c9",
  measurementId: "G-M251YZM8GZ"
};

let app;
let auth: any = null;
let db: any = null;
let useSimulatedDB = false;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase failed to initialize. Falling back to local simulated database.", error);
  useSimulatedDB = true;
}

export { auth, db, useSimulatedDB };

// We will also build a robust Local Storage manager for absolute reliability!
const STORAGE_PREFIX = "foodcanteen_";

export const localDB = {
  get: (key: string, fallback: any) => {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }
};
