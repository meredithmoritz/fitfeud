import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/fire";

const AuthContext = createContext();

export const UserAuth = () => {
    return useContext(AuthContext);
}

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const unsubscribeDoc = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    setUser({ uid: currentUser.uid, ...doc.data() });
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });

                return () => {
                    unsubscribeDoc();
                }
            } else {
                setUser(null);
                setLoading(false);
            }
        }, (error) => {
            console.error("Error with auth state change:", error);
            setLoading(false);
        });
        // Cleanup auth listener on component unmount
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
