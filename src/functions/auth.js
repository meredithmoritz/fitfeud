import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
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
        const user = createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "Users", user.user.uid), {
            ...userData,
            uid: user.user.uid,
        });
        return user.user;
    } catch (error) {
        return error;
    }
}