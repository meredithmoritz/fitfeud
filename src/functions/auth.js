import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from "../firebase/fire";
import { doc, getDocs, query, collection, where, runTransaction } from "firebase/firestore";

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
        // Check if username exists first
        const usernameQuery = await getDocs(
            query(
                collection(db, "users"),
                where("username", "==", userData.username.toLowerCase())
            )
        );

        if (!usernameQuery.empty) {
            throw new Error("username-already-exists");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Use runTransaction instead of db.runTransaction
        await runTransaction(db, async (transaction) => {
            const counterRef = doc(db, "counters", "users");
            const counterDoc = await transaction.get(counterRef);

            let newUserId;
            if (!counterDoc.exists()) {
                newUserId = 1;
                transaction.set(counterRef, { latestUserId: 1 });
            } else {
                newUserId = counterDoc.data().latestUserId + 1;
                transaction.update(counterRef, { latestUserId: newUserId });
            }

            const userDocRef = doc(db, "users", user.uid);
            transaction.set(userDocRef, {
                ...userData,
                username: userData.username.toLowerCase(),
                role: userData.role || "user",
                uid: user.uid,
                createdAt: new Date().toISOString(),
                userId: newUserId
            });
        });

        return user;
    } catch (error) {
        console.error("Error signing up: ", error);

        // Return structured errors for all cases
        if (error.code === "auth/username-already-in-use") {
            throw error; // Already structured correctly
        } else if (error.code?.startsWith("auth/")) {
            throw error; // Firebase auth errors are already structured
        } else {
            throw {
                code: "registration/unknown-error",
                message: "An unexpected error occurred during registration"
            };
        }
    }
}