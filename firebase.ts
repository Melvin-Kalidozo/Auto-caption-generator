import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmfI7RK-I1YWgOfvoOZIcOgQdLj6g5w0E",
  authDomain: "autocap-513f8.firebaseapp.com",
  projectId: "autocap-513f8",
  storageBucket: "autocap-513f8.appspot.com",
  messagingSenderId: "1051591950454",
  appId: "1:1051591950454:web:1b903870b16106f5bd9f57",
  measurementId: "G-V9MXW3ZNZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
