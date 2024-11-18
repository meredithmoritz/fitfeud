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
        return <div className="loading loading-spinner loading-lg"></div>;
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
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

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Workout Log</h1>
                <Link to="/workouts/create" className="btn btn-primary">
                    <Plus /> Add Workout
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
                    {workouts.map((workout, index) => (
                        <div key={workout.id} className="card bg-base-100 shadow-lg mb-6">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <h2 className="card-title">
                                        {formatDate(workout.createdAt)}
                                    </h2>
                                    <span className="badge badge-primary">
                                        {workout.category}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    {workout.exercises.map((exercise, idx) => (
                                        <div key={idx} className="mb-2">
                                            <p className="font-medium">{exercise.exerciseName}</p>
                                            <p className="text-sm text-gray-600">
                                                {exercise.sets.length} sets
                                            </p>
                                        </div>
                                    ))}
                                </div>

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
                    ))}

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