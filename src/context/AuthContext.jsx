import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/fire";

const AuthContext = createContext();

export const UserAuth = () => {
    return useContext(AuthContext)
}

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const unsubscribeDoc = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    setUser({ uid: currentUser.uid, ...doc.data() });
                }, (error) => {
                    console.error("Error fetching user data:", error);
                });

                return () => {
                    unsubscribeDoc();
                }
            } else {
                setUser(null);
            }
        }, (error) => {
            console.error("Error with auth state change:", error);
        });
        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    );
}
