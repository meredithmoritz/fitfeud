import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import { join } from 'path';

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
    registrationTestUsers: {
        [key: string]: TestUser;
    };
}

async function verifyDocument(db, path: string, id: string) {
    const docRef = doc(db, path, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log(`✅ Verified ${path}/${id}`);
        return true;
    }
    console.error(`❌ Document not found: ${path}/${id}`);
    return false;
}

async function initializeCounters(db) {
    console.log('📊 Initializing counters collection...');
    try {
        const counterRef = doc(db, 'counters', 'users');
        await setDoc(counterRef, { latestUserId: 0 });

        // Verify counter was created
        const verified = await verifyDocument(db, 'counters', 'users');
        if (!verified) {
            throw new Error('Failed to create counters document');
        }
    } catch (error) {
        console.error('❌ Error initializing counters:', error);
        throw error;
    }
}

export async function seedTestData() {
    try {
        console.log('📖 Reading test user data...');
        const data = await readFile(join(TEST_DIR, 'fixtures/users.json'), 'utf-8');
        const allUsersData = JSON.parse(data) as TestData;

        const usersToSeed = {
            testUsers: allUsersData.testUsers
        };

        console.log('🔥 Initializing Firebase...');
        const app = initializeApp({
            apiKey: 'fake-api-key',
            projectId: 'fitfeud-dev',
            authDomain: 'fitfeud-dev.firebaseapp.com',
            storageBucket: 'fitfeud-dev.appspot.com',
        }, 'seed-test-app');

        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('🔌 Connecting to emulators...');
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);

        await initializeCounters(db);

        for (const [key, userData] of Object.entries(usersToSeed.testUsers)) {
            try {
                console.log(`\n👤 Processing user: ${userData.email}`);

                const usernameQuery = await getDocs(query(
                    collection(db, "users"),
                    where("username", "==", userData.username.toLowerCase())
                ));

                if (!usernameQuery.empty) {
                    throw new Error("username-already-exists");
                }

                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    userData.email,
                    userData.password
                );

                const counterRef = doc(db, "counters", "users");
                const counterDoc = await getDoc(counterRef);
                const newUserId = (counterDoc.exists() ? counterDoc.data().latestUserId : 0) + 1;

                const userDocRef = doc(db, "users", userCredential.user.uid);
                const userDocData = {
                    ...userData,
                    username: userData.username.toLowerCase(),
                    role: "user",
                    uid: userCredential.user.uid,
                    createdAt: new Date().toISOString(),
                    userId: newUserId
                };

                await setDoc(userDocRef, userDocData);

                // Verify user document was created
                const verified = await verifyDocument(db, 'users', userCredential.user.uid);
                if (!verified) {
                    throw new Error(`Failed to verify user document for ${userData.email}`);
                }

                await setDoc(counterRef, { latestUserId: newUserId }, { merge: true });
                console.log(`✅ User created: ${userData.email} with ID: ${newUserId}`);

            } catch (error) {
                console.error(`❌ Error processing user ${userData.email}:`, error);
                throw error;
            }
        }

        // Final verification
        console.log('\n🔍 Verifying all data...');
        const usersSnapshot = await getDocs(collection(db, 'users'));
        console.log(`Found ${usersSnapshot.size} users in Firestore`);
        usersSnapshot.forEach(doc => {
            console.log('- User:', doc.data().email);
        });

    } catch (error) {
        console.error('❌ Error seeding test data:', error);
        throw error;
    }
}