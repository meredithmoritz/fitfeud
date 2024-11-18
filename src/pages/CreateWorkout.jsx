import React, {useEffect, useState} from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form'; // Add Controller
import Select from 'react-select';
import exercises from '../data/exercises.json';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { createWorkout } from '../functions/workouts';
import { BicepsFlexed, Ellipsis } from 'lucide-react';

const strengthExercises = exercises
    .filter(ex => ex.category === 'strength')
    .map(ex => ({
        value: ex.id,
        label: ex.name,
        ...ex
    }));
const CreateWorkout = () => {
    const navigate = useNavigate();
    const { user } = UserAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            exercises: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "exercises"
    });

    useEffect(() => {
        if (selectedCategory && fields.length === 0) {
            append({ exercise: null, sets: [] });
        }
    }, [selectedCategory, fields.length, append]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const workoutData = {
                category: selectedCategory,
                exercises: data.exercises.map(exercise => ({
                    exerciseId: exercise.exercise.value,
                    exerciseName: exercise.exercise.label,
                    sets: exercise.sets.map(set => ({
                        weight: parseFloat(set.weight),
                        reps: parseInt(set.reps)
                    })),
                    notes: exercise.notes || ''
                })),
                createdAt: new Date()
            };

            await createWorkout(workoutData, user.uid); // Pass uid here
            navigate('/workouts');
        } catch (error) {
            console.error('Error creating workout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Add Workout</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Category Selection */}
                <div className="mb-6">
                    <label className="font-medium mb-2 block">Select Category</label>
                    <div className="btn-group">
                        <button
                            type="button"
                            className={`btn btn-primary ${selectedCategory === 'strength' ? 'btn-secondary' : ''}`}
                            onClick={() => setSelectedCategory('strength')}
                        >
                            <BicepsFlexed size={20}/>Strength
                        </button>
                        <div className="tooltip" data-tip="More coming soon!">
                            <button
                                type="button"
                                className="btn btn-outline btn-disabled ml-1"
                                disabled
                            >
                                <Ellipsis size={20}/>
                            </button>
                        </div>
                        </div>
                    </div>

                {selectedCategory && (
                    <>
                        {/* Exercise List */}
                        {fields.map((field, exerciseIndex) => (
                            <div key={field.id} className="card bg-base-100 shadow-lg mb-6">
                                <div className="card-body">
                                    <div className="flex justify-between items-center">
                                        <h2 className="card-title">Exercise {exerciseIndex + 1}</h2>
                                        <button
                                            type="button"
                                            className="btn btn-square btn-error btn-sm"
                                            onClick={() => remove(exerciseIndex)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Exercise Selection */}
                                    <div className="mb-4">
                                        <label className="font-medium mb-2 block">Select Exercise</label>
                                        <Controller
                                            name={`exercises.${exerciseIndex}.exercise`}
                                            control={control}
                                            rules={{required: 'Please select an exercise'}}
                                            render={({field}) => (
                                                <Select
                                                    {...field}
                                                    options={strengthExercises}
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    isSearchable={true}
                                                    placeholder="Search or select an exercise..."
                                                />
                                            )}
                                        />
                                        {errors.exercises?.[exerciseIndex]?.exercise && (
                                            <p className="text-error text-sm mt-1">
                                                {errors.exercises[exerciseIndex].exercise.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sets */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="font-medium">Sets</label>
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    const currentSets = watch(`exercises.${exerciseIndex}.sets`) || [];
                                                    setValue(`exercises.${exerciseIndex}.sets`, [
                                                        ...currentSets,
                                                        {weight: '', reps: ''}
                                                    ]);
                                                }}
                                            >
                                                Add Set
                                            </button>
                                        </div>

                                        {(watch(`exercises.${exerciseIndex}.sets`) || []).map((set, setIndex) => (
                                            <div key={setIndex} className="flex gap-4 items-center mb-2">
                                                <span className="font-medium text-sm w-8">#{setIndex + 1}</span>
                                                <div className="flex-1">
                                                    <input
                                                        type="number"
                                                        className="input input-bordered w-full"
                                                        placeholder="Weight (lbs)"
                                                        {...register(`exercises.${exerciseIndex}.sets.${setIndex}.weight`, {
                                                            required: "Weight is required",
                                                            min: {value: 0, message: "Weight must be positive"},
                                                            max: {value: 9999, message: "Weight too high"}
                                                        })}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="number"
                                                        className="input input-bordered w-full"
                                                        placeholder="Reps"
                                                        {...register(`exercises.${exerciseIndex}.sets.${setIndex}.reps`, {
                                                            required: "Reps are required",
                                                            min: {value: 1, message: "At least 1 rep required"},
                                                            max: {value: 999, message: "Too many reps"}
                                                        })}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => {
                                                        const currentSets = watch(`exercises.${exerciseIndex}.sets`);
                                                        setValue(
                                                            `exercises.${exerciseIndex}.sets`,
                                                            currentSets.filter((_, idx) => idx !== setIndex)
                                                        );
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                        {errors.exercises?.[exerciseIndex]?.sets && (
                                            <p className="text-error text-xs mt-1">Please add at least one set</p>
                                        )}
                                    </div>

                                    {/* Exercise Notes */}
                                    <div>
                                        <label className="font-medium mb-2 block">Notes</label>
                                        <textarea
                                            className="textarea textarea-bordered w-full"
                                            placeholder="Add notes for this exercise..."
                                            {...register(`exercises.${exerciseIndex}.notes`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Exercise Button */}
                        <button
                            type="button"
                            className="btn btn-outline w-full mb-6"
                            onClick={() => append({exercise: null, sets: [], notes: ''})}
                        >
                            Add Another Exercise
                        </button>
                    </>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isLoading || fields.length === 0}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner"></span>
                            Saving...
                        </>
                    ) : (
                        'Save Workout'
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateWorkout;