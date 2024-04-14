import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyB5rTPBd1uHDUbJUkRCWfE5yh1XIlsM9pw",
  authDomain: "proconnect-63073.firebaseapp.com",
  projectId: "proconnect-63073",
  storageBucket: "proconnect-63073.appspot.com",
  messagingSenderId: "427373837428",
  appId: "1:427373837428:web:42c583e933af9535566521"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app)
export const database = getFirestore(app)