import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/fire";

const UserContext = createContext();

export const UserAuth = () => {
    return useContext(UserContext)
}

export default function AuthContextProvider({ children }) {
    const [isLoggedOut, setIsLoggedOut] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const unsubscribeDoc = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                    setUser({ uid: currentUser.uid, ...doc.data() });
                }, (error) => {
                    console.error("Error fetching user data:", error);
                });

                console.log("It ran again");

                return () => {
                    unsubscribeDoc();
                }
            } else {
                setUser(null);
            }
        });
        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    );
}
