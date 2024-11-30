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
        let unsubscribeDoc = null;
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            // Clean up existing document listener if it exists
            if (unsubscribeDoc) {
                unsubscribeDoc();
                unsubscribeDoc = null;
            }

            if (currentUser) {
                // Add small delay if this is right after registration
                setTimeout(() => {
                    unsubscribeDoc = onSnapshot(
                        doc(db, "users", currentUser.uid),
                        (doc) => {
                            if (doc.exists()) {
                                setUser({ uid: currentUser.uid, ...doc.data() });
                            } else {
                                console.warn("User document does not exist");
                                setUser(currentUser);
                            }
                            setLoading(false);
                        },
                        (error) => {
                            console.error("Error fetching user data:", error);
                            setUser(currentUser);
                            setLoading(false);
                        }
                    );
                }, 1000);
            } else {
                // User is logged out
                setUser(null);
                setLoading(false);
            }
        }, (error) => {
            console.error("Error with auth state change:", error);
            setLoading(false);
        });

        // Cleanup function
        return () => {
            if (unsubscribeDoc) {
                unsubscribeDoc();
            }
            unsubscribeAuth();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
