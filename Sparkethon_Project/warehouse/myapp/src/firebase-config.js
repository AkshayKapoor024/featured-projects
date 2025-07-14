import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQEkTNa_bHhxKk7K8h_AtNOrCMe7DBKj0",
  authDomain: "warehouse-d3bc2.firebaseapp.com",
  projectId: "warehouse-d3bc2",
  storageBucket: "warehouse-d3bc2.firebasestorage.app",
  messagingSenderId: "168620236711",
  appId: "1:168620236711:web:8eafcd28f6bdb6c0222082",
  measurementId: "G-ZZP3BTQ0Q5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app); 