import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);