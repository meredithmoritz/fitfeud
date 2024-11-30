import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from "../firebase/fire";
import { doc, getDoc, getDocs, setDoc, query, collection, where, runTransaction } from "firebase/firestore";

export const signIn = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
    } catch (error) {
        console.error("Sign in error:", error)
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
        const usernameQuery = await getDocs(query(
            collection(db, "users"),
            where("username", "==", userData.username.toLowerCase())
        ));

        if (!usernameQuery.empty) {
            throw new Error("username-already-exists");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const counterRef = doc(db, "counters", "users");
        const counterDoc = await getDoc(counterRef);
        const newUserId = (counterDoc.exists() ? counterDoc.data().latestUserId : 0) + 1;

        await setDoc(doc(db, "users", user.uid), {
            ...userData,
            username: userData.username.toLowerCase(),
            role: "user",
            uid: user.uid,
            createdAt: new Date().toISOString(),
            userId: newUserId
        });

        await setDoc(counterRef, { latestUserId: newUserId }, { merge: true });
        return user;

    } catch (error) {
        console.error("Error signing up: ", error);
        throw error;
    }
};