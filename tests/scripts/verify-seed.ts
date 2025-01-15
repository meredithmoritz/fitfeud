import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, getDocs, doc, getDoc } from 'firebase/firestore';

async function verifySeededData() {
    console.log('🔍 Starting verification...');

    const app = initializeApp({
        apiKey: 'fake-api-key',
        projectId: 'demo-project',
    }, 'verify-test-app');

    const db = getFirestore(app);
    connectFirestoreEmulator(db, 'localhost', 8080);

    try {
        // Check counters collection
        console.log('\n📊 Checking counters collection...');
        const counterDoc = await getDoc(doc(db, 'counters', 'users'));
        if (counterDoc.exists()) {
            console.log('Counter document:', counterDoc.data());
        } else {
            console.log('❌ Counter document not found');
        }

        // Check users collection
        console.log('\n👥 Checking users collection...');
        const usersSnapshot = await getDocs(collection(db, 'users'));

        if (usersSnapshot.empty) {
            console.log('❌ No users found in Firestore');
        } else {
            console.log(`Found ${usersSnapshot.size} users:`);
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                console.log(`- ${userData.email} (ID: ${userData.userId})`);
            });
        }

    } catch (error) {
        console.error('❌ Error verifying data:', error);
        throw error;
    }
}

verifySeededData().catch(console.error);