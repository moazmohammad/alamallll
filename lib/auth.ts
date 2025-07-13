import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEt8j6viDMU8pLW6TZWp0Jl9sguSTYwxg",
  authDomain: "alamal-592e2.firebaseapp.com",
  projectId: "alamal-592e2",
  storageBucket: "alamal-592e2.firebasestorage.app",
  messagingSenderId: "328658685577",
  appId: "1:328658685577:web:0e9e094e1d720bd520c058",
  measurementId: "G-HL1EHV6LTK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Register a new user
export async function register(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Login user
export async function login(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

// Logout user
export async function logout(): Promise<void> {
  return await signOut(auth);
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}