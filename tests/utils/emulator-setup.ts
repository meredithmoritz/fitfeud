import { initializeApp, FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, Firestore } from 'firebase/firestore';

interface EmulatorSetup {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
}

interface TestUser {
    email: string;
    password: string;
    displayName: string;
}

export const setupEmulators = (): EmulatorSetup => {
    const firebaseConfig = {
        projectId: 'fitfeud-dev',
        apiKey: process.env.FIREBASE_TEST_API_KEY || 'fake-api-key',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Connect to emulators
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);

    return { app, auth, db };
};

export const seedTestUser = async (auth: Auth, db: Firestore): Promise<TestUser> => {
    const testUser: TestUser = {
        email: 'test@example.com',
        password: 'testpass123',
        displayName: 'Test User'
    };

    try {
        const response = await fetch('http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password,
                returnSecureToken: true
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create test user: ${response.statusText}`);
        }

        return testUser;
    } catch (error) {
        console.error('Failed to seed test user:', error);
        throw error;
    }
};