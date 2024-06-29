import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebase/fire";
import { doc, setDoc } from "firebase/firestore";

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
    } catch (error) {
        return error;
    }
}

export const signUp = async (email, password, userData) => {
    try {
        //const user = createUserWithEmailAndPassword(auth, email, password);

        // Await the user creation process
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Set user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            ...userData,
            uid: user.uid,
        });
        return user;
    } catch (error) {
        console.error("Error signing up: ", error);
        return error;
    }
}