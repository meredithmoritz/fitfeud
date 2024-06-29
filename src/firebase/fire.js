import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDqZYXwkeLYRm9rBYujeRokzJI8o45gRYE",
    authDomain: "fitfeud-34151.firebaseapp.com",
    projectId: "fitfeud-34151",
    storageBucket: "fitfeud-34151.appspot.com",
    messagingSenderId: "1051381490700",
    appId: "1:1051381490700:web:c292d29f5c6b7c5429ba29",
    measurementId: "G-0TZJPKN7ML"
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);