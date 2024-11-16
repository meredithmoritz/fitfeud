import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from "../firebase/fire";

export const signIn = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        console.log('Logged in successfully', res);
        return res.user;
    } catch (error) {
        console.error('Error logging in:', error);
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
        // Create user in Firebase Authentication first
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = res.user;

        console.log('User created in Firebase Authentication:', res);

        // Call the backend to create the user document in Firestore
        const userDocResponse = await fetch('http://localhost:5000/api/createUserDocument', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, userData, uid }),
        });

        if (!userDocResponse.ok) {
            throw new Error('Failed to create user document');
        }

        const data = await userDocResponse.json();
        if (userDocResponse.status === 201) {
            console.log('User registered successfully:', data);
            return data;
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};