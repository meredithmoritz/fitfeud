import { db } from "../firebase/fire";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    startAfter
} from "firebase/firestore";

export const createWorkout = async (workoutData, uid) => {
    try {
        const workoutRef = await addDoc(collection(db, "workouts"), {
            ...workoutData,
            uid, // Use uid instead of userId
            createdAt: serverTimestamp()
        });
        return workoutRef.id;
    } catch (error) {
        console.error("Error creating workout:", error);
        throw error;
    }
};

export const getUserWorkouts = async (uid, lastWorkout = null, itemsPerPage = 5) => {
    try {
        let q = query(
            collection(db, "workouts"),
            where("uid", "==", uid), // Use uid instead of userId
            orderBy("createdAt", "desc"),
            limit(itemsPerPage)
        );

        if (lastWorkout) {
            q = query(q, startAfter(lastWorkout));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching workouts:", error);
        throw error;
    }
};