import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB90iUCMq-JlPv5TsQTK6GIEDLedj9Bq4k",
  authDomain: "neurobridge-ai-42e10.firebaseapp.com",
  projectId: "neurobridge-ai-42e10",
  storageBucket: "neurobridge-ai-42e10.firebasestorage.app",
  messagingSenderId: "910119574405",
  appId: "1:910119574405:web:15825aaec45fe8f17182ec",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});