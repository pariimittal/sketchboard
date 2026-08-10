import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-1pVt5SoA8v0CcOiJhpASac0IAPLmfaE",
  authDomain: "sketchboard-aae31.firebaseapp.com",
  projectId: "sketchboard-aae31",
  storageBucket: "sketchboard-aae31.firebasestorage.app",
  messagingSenderId: "555858948759",
  appId: "1:555858948759:web:ceb3a4d0769b851b15efd2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export { signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, doc, setDoc, getDoc, collection, getDocs };