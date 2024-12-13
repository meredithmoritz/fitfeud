import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

export const initializeTestFirebase = () => {
    // Validate required environment variables
    const requiredEnvVars = [
        'FIREBASE_TEST_PROJECT_ID',
        'FIREBASE_TEST_API_KEY',
        'FIREBASE_TEST_MESSAGING_SENDER_ID',
        'FIREBASE_TEST_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    const firebaseConfig: FirebaseOptions = {
        apiKey: process.env.FIREBASE_TEST_API_KEY,
        authDomain: `${process.env.FIREBASE_TEST_PROJECT_ID}.firebaseapp.com`,
        projectId: process.env.FIREBASE_TEST_PROJECT_ID,
        storageBucket: `${process.env.FIREBASE_TEST_PROJECT_ID}.appspot.com`,
        messagingSenderId: process.env.FIREBASE_TEST_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_TEST_APP_ID
    };

    try {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Connect to emulators if enabled
        if (process.env.USE_FIREBASE_EMULATOR === 'true') {
            console.log('🔧 Connecting to Firebase emulators...');
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8080);
        }

        return { app, auth, db };
    } catch (error) {
        console.error('Firebase initialization error:', error);
        throw error;
    }
};