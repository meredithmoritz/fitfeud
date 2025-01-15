import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { getUserWorkouts } from '../functions/workouts';
import { Plus } from 'lucide-react';

const WorkoutLog = () => {
    const { user } = UserAuth();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    // Handle loading more
    const handleLoadMore = async () => {
        try {
            if (!user || workouts.length === 0) return;
            const lastWorkout = workouts[workouts.length - 1];
            const newWorkouts = await getUserWorkouts(user.uid, lastWorkout);
            setWorkouts(prev => [...prev, ...newWorkouts]);
            setHasMore(newWorkouts.length === 5);
        } catch (err) {
            setError('Failed to load more workouts');
            console.error(err);
        }
    };

    const groupExercisesByCategory = (exercises) => {
        return exercises.reduce((acc, exercise) => {
            if (!acc[exercise.category]) {
                acc[exercise.category] = [];
            }
            acc[exercise.category].push(exercise);
            return acc;
        }, {});
    };

    useEffect(() => {
        // Initial load function inside useEffect
        const loadInitialWorkouts = async () => {
            try {
                if (!user) return;
                const newWorkouts = await getUserWorkouts(user.uid, null);
                setWorkouts(newWorkouts);
                setHasMore(newWorkouts.length === 5);
            } catch (err) {
                setError('Failed to load workouts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadInitialWorkouts();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="skeleton h-4 w-28 mb-2"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div role="alert" className="alert alert-error text-xs p-2 mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{error}</span>
            </div>
        );
    }

    const formatDate = (timestamp) => {
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    // Helper to summarize sets
    const formatSets = (sets) => {
        const totalSets = sets.length;
        if (totalSets === 0) return "No sets";

        // Get the weight range
        const weights = sets.map(set => set.weight);
        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);

        if (minWeight === maxWeight) {
            return `${totalSets} sets @ ${minWeight}lbs`;
        }
        return `${totalSets} sets (${minWeight}-${maxWeight}lbs)`;
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Workout Log</h1>
                <Link to="/workouts/create" className="btn btn-primary">
                    <Plus size="16" /> Add Workout
                </Link>
            </div>

            {workouts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="mb-4">No workouts logged yet!</p>
                    <Link to="/workouts/create" className="btn btn-primary">
                        Log Your First Workout
                    </Link>
                </div>
            ) : (
                <>
                    {workouts.map((workout) => {
                        const groupedExercises = groupExercisesByCategory(workout.exercises);

                        return (
                            <div key={workout.id} className="card bg-base-100 shadow-lg mb-6">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <h2 className="card-title">
                                            {formatDate(workout.createdAt)}
                                        </h2>
                                    </div>

                                    <div className="mt-4">
                                        {Object.entries(groupedExercises).map(([category, exercises]) => (
                                            <div key={category} className="mb-4">
                                                <h3 className="font-semibold text-lg mb-2">
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </h3>
                                                {exercises.map((exercise, idx) => (
                                                    <div key={idx} className="ml-4 mb-2">
                                                        <p className="font-medium">{exercise.exerciseName}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {formatSets(exercise.sets)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    {workout.notes && (
                                        <div className="mt-4 text-sm text-gray-600">
                                            <p className="font-medium">Notes:</p>
                                            <p>{workout.notes}</p>
                                        </div>
                                    )}

                                    <div className="card-actions justify-end mt-4">
                                        <Link
                                            to={`/workouts/${workout.id}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {hasMore && (
                        <button
                            className="btn btn-outline w-full mt-4"
                            onClick={handleLoadMore}
                        >
                            Load More
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default WorkoutLog;