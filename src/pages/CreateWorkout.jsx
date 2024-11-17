import React, { useState } from 'react';
import { db } from "../firebase/fire";
import { UserAuth } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; // Update this line to use useNavigate

const CreateWorkoutForm = () => {
    const { user } = UserAuth();
    const [exerciseName, setExerciseName] = useState("Squat");
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (weight && reps) {
            setLoading(true);
            try {
                const workoutsRef = collection(db, "users", user.uid, "workouts");
                await addDoc(workoutsRef, {
                    exerciseName,
                    weight: parseFloat(weight),
                    reps: parseInt(reps),
                    date: serverTimestamp(),
                    createdAt: serverTimestamp(),
                    userId: user.uid,
                });
                navigate("/workout-log"); // Use navigate() to redirect
            } catch (error) {
                console.error("Error adding workout:", error);
                setLoading(false);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Add New Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="exerciseName" className="block">Exercise</label>
                    <select
                        id="exerciseName"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="Squat">Squat</option>
                        <option value="Deadlift">Deadlift</option>
                        <option value="Bench Press">Bench Press</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="weight" className="block">Weight (kg)</label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="reps" className="block">Reps</label>
                    <input
                        type="number"
                        id="reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Workout"}
                </button>
            </form>
        </div>
    );
};

export default CreateWorkoutForm;
