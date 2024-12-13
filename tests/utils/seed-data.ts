import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth } from 'firebase/auth';
import { getFirestore, doc, setDoc, Firestore } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Use process.cwd() to get the project root directory
const TEST_DIR = join(process.cwd(), 'tests');

interface TestUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
}

interface TestData {
    testUsers: {
        [key: string]: TestUser;
    };
}

export async function seedTestData() {
    try {
        // Load users data using absolute path from project root
        const data = await readFile(join(TEST_DIR, 'fixtures/users.json'), 'utf-8');
        const usersData = JSON.parse(data) as TestData;

        // Initialize Firebase with any config (it won't actually connect to Firebase)
        const app = initializeApp({
            apiKey: 'fake-api-key',
            projectId: 'demo-project',
        });

        // Get Auth and Firestore instances
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Connect to emulators
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);

        // Create each test user in Auth and Firestore
        for (const [key, userData] of Object.entries(usersData.testUsers)) {
            try {
                // Create user in Auth
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    userData.email,
                    userData.password
                );

                // Add user data to Firestore
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    username: userData.username,
                    createdAt: new Date().toISOString(),
                    uid: userCredential.user.uid
                });

                console.log(`✅ Created test user: ${userData.email}`);
            } catch (error) {
                console.warn(`⚠️ Error creating user ${userData.email}:`, error);
            }
        }

        console.log('🌱 Test data seeding completed');
    } catch (error) {
        console.error('❌ Error seeding test data:', error);
        throw error;
    }
}