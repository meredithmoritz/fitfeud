import React, { useEffect, useState } from 'react';
import { db } from "../firebase/fire";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

const WorkoutLog = () => {
    const { user } = UserAuth();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (user) {
                try {
                    const workoutsRef = collection(db, "users", user.uid, "workouts");
                    const q = query(workoutsRef, orderBy("createdAt", "desc"), limit(5));
                    const querySnapshot = await getDocs(q);
                    const workoutList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setWorkouts(workoutList);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching workouts:", error);
                }
            }
        };

        fetchWorkouts();
    }, [user]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Workout Log</h2>
            {loading ? (
                <p>Loading...</p>
            ) : workouts.length === 0 ? (
                <p>No entries yet!</p>
            ) : (
                <ul>
                    {workouts.map((workout) => (
                        <li key={workout.id} className="mb-2">
                            <div className="p-4 border rounded">
                                <h3 className="font-semibold">{workout.exerciseName}</h3>
                                <p>Weight: {workout.weight} kg</p>
                                <p>Reps: {workout.reps}</p>
                                <p>Date: {new Date(workout.date.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/workouts/add">
                <button className="mt-4 p-2 bg-blue-500 text-white rounded">Add New Workout</button>
            </Link>
        </div>
    );
};

export default WorkoutLog;