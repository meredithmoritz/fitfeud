import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const configs = {
    development: {
        apiKey: "AIzaSyAw7n52UncGHLV6ASY1PAwOT2_XgT-5jPk",
        authDomain: "fitfeud-dev.firebaseapp.com",
        projectId: "fitfeud-dev",
        messagingSenderId: "563932128447",
    },
    production: {
        apiKey: "AIzaSyDqZYXwkeLYRm9rBYujeRokzJI8o45gRYE",
        authDomain: "fitfeud-34151.firebaseapp.com",
        projectId: "fitfeud-34151",
        storageBucket: "fitfeud-34151.appspot.com",
        messagingSenderId: "1051381490700",
        appId: "1:1051381490700:web:c292d29f5c6b7c5429ba29",
        measurementId: "G-0TZJPKN7ML"
    }
};

// Initialize Firebase
const getFirebaseConfig = () => {
    const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    return configs[env];
};

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators in test mode
if (process.env.REACT_APP_USE_EMULATOR === 'true') {
    console.log('🔧 Using Firebase Emulators');
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
}

export { auth, db };