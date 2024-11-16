import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from "../firebase/fire";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const signIn = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        console.log(res, res);
        return res.user;
    } catch (error) {
        return error;
    }
}

export const logOut = async () => {
    try {
        await auth.signOut();
        return true; // Indicate success
    } catch (error) {
        throw error; // Throw the error to be handled by the caller
    }
};

export const signUp = async (email, password, userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get the latest user ID
        const counterRef = doc(db, "counters", "users");
        const counterSnap = await getDoc(counterRef);
        let newUserId = 1;

        if (counterSnap.exists()) {
            const data = counterSnap.data();
            newUserId = data.latestUserId + 1;
        } else {
            // If the document doesn't exist, initialize it with the first user ID
            await setDoc(counterRef, { latestUserId: 1 });
        }

        // Set the default role to 'user' upon registering
        const role = userData.role || "user";

        // Set user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            ...userData,
            role,
            uid: user.uid,
            createdAt: new Date(),
            userId: newUserId
        });

        // Update the latest user ID in the counter document
        await updateDoc(counterRef, {
            latestUserId: newUserId
        });

        return user;
    } catch (error) {
        console.error("Error signing up: ", error);
        return error;
    }
}