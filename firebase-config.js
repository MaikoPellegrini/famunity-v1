import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAx_GRWbpqfrvzJ5VmBksi4Fd9FU77rIvk",
  authDomain: "famunity-1.firebaseapp.com",
  projectId: "famunity-1",
  storageBucket: "famunity-1.firebasestorage.app",
  messagingSenderId: "374801967486",
  appId: "1:374801967486:web:6a17381f9c272f3ed0eb2f",
  measurementId: "G-QNSVDC7ZSG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);