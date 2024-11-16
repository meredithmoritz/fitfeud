import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/fire";

const AuthContext = createContext();

export const UserAuth = () => {
    return useContext(AuthContext);
}

// AuthContext Provider
export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to the Firebase auth state change
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Listen to the user document in Firestore
                const unsubscribeDoc = onSnapshot(
                    doc(db, "users", currentUser.uid),
                    (docSnapshot) => {
                        if (docSnapshot.exists()) {
                            // Set user state with data from Firestore
                            setUser({ uid: currentUser.uid, ...docSnapshot.data() });
                        } else {
                            // Handle case where the document doesn't exist
                            console.error('User document not found for UID:', currentUser.uid);
                        }
                        // Set loading to false once user data is fetched
                        setLoading(false);
                    },
                    (error) => {
                        console.error("Error fetching user data:", error);
                        setLoading(false); // Stop loading even on error
                    }
                );

                // Clean up the Firestore subscription when the component is unmounted
                return () => unsubscribeDoc();
            } else {
                // If no user is authenticated, set user to null and stop loading
                setUser(null);
                setLoading(false);
            }
        }, (error) => {
            console.error("Error with auth state change:", error);
            setLoading(false); // Stop loading even on error
        });

        // Clean up the auth state listener when the component is unmounted
        return () => unsubscribeAuth();
    }, []); // Empty dependency array to run only once after the first render

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}