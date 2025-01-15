import { getFirestore, doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';

export async function cleanupTestUser(email: string) {
    const db = getFirestore();
    const auth = getAuth();

    // Delete from Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
        await deleteDoc(doc.ref);
    }

    // Delete from Auth if user exists
    if (auth.currentUser) {
        await deleteUser(auth.currentUser);
    }
}