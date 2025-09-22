// firebaseConfig.js (na raiz)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjhINAWBzU94RVdO7Zs_ohNnhbr4kW5i0",
  authDomain: "hora-do-remedio-web01.firebaseapp.com",
  projectId: "hora-do-remedio-web01",
  storageBucket: "hora-do-remedio-web01.firebasestorage.app",
  messagingSenderId: "511727124624",
  appId: "1:511727124624:web:2caa0cd21eb009faf81815"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);