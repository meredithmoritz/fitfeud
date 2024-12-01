import React, {useEffect, useState} from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form'; // Add Controller
import Select from 'react-select';
import exercises from '../data/exercises.json';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { createWorkout } from '../functions/workouts';
import { BicepsFlexed, Plus, X, Copy } from 'lucide-react';

const exerciseCategories = [
    { value: 'strength', label: 'Strength', icon: BicepsFlexed },
    // Add more categories later:
    // { value: 'cardio', label: 'Cardio', icon: Heart },
    // { value: 'flexibility', label: 'Flexibility', icon: Stretch },
];

const organizedExercises = exercises.reduce((acc, exercise) => {
    // Create an option object for react-select
    const exerciseOption = {
        value: exercise.id,
        label: exercise.name,
        category: exercise.category,
        ...exercise
    };

    // Add the exercise to its category array
    if (!acc[exercise.category]) {
        acc[exercise.category] = [];
    }
    acc[exercise.category].push(exerciseOption);

    return acc;
}, {});

// Helper function to get exercises for a selected category
const getExercisesForCategory = (categoryValue) => {
    return categoryValue ? organizedExercises[categoryValue] || [] : [];
};

const CreateWorkout = () => {
    const navigate = useNavigate();
    const { user } = UserAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    // Initial form state
    const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            exercises: [{ exercise: null, sets: [1] }],
            notes: ''
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

    const validateSets = (sets) => {
        if (!sets || sets.length === 0) {
            return false;
        }
        // Check if all sets have both weight and reps
        return sets.every(set => set.weight && set.reps);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError(null);
        try {
            // create user workout doc
            const workoutData = {
                exercises: data.exercises.map(exercise => ({
                    exerciseId: exercise.exercise.value,
                    exerciseName: exercise.exercise.label,
                    category: exercise.category.value,
                    sets: exercise.sets.map(set => ({
                        weight: parseFloat(set.weight),
                        reps: parseInt(set.reps)
                    }))
                })),
                notes: data.notes || ''
            };
            const workoutId = await createWorkout(workoutData, user.uid);
            navigate(`/workouts/`);
        } catch (error) {
            console.error('Error creating workout:', error);
            setServerError('Failed to create workout. Please try again.');
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
                {serverError && (
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
                        <span>{serverError}</span>
                    </div>
                )}

                {/* Exercise List */}
                {fields.map((field, exerciseIndex) => (
                    <div key={field.id} className={`card bg-base-100 shadow-lg mb-6 ${
                        field.category && field.exercise && field.sets?.length > 0
                            ? 'border-l-4 border-success'
                            : ''
                    }`}>
                        <div className="card-body">
                            <div className="flex justify-between items-center">
                                <h2 className="card-title">Exercise {exerciseIndex + 1}</h2>
                                <button
                                    type="button"
                                    className="btn btn-square btn-error btn-sm"
                                    onClick={() => remove(exerciseIndex)}
                                >
                                    <X size={18}/>
                                </button>
                            </div>

                            {/* Category Selection */}
                            <div className="mb-4">
                                <label className="font-medium mb-2 block">Category</label>
                                <Controller
                                    name={`exercises.${exerciseIndex}.category`}
                                    control={control}
                                    rules={{required: 'Please select a category'}}
                                    render={({field}) => (
                                        <Select
                                            {...field}
                                            options={exerciseCategories}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="Select category..."
                                            formatOptionLabel={({label, icon: Icon}) => (
                                                <div className="flex items-center gap-2">
                                                    {Icon && <Icon size={18}/>}
                                                    <span>{label}</span>
                                                </div>
                                            )}
                                        />
                                    )}
                                />
                                {errors.exercises?.[exerciseIndex]?.category && (
                                    <p className="text-error text-sm mt-1">
                                        {errors.exercises[exerciseIndex].category.message}
                                    </p>
                                )}
                            </div>

                            {/* Exercise Selection */}
                            <div className="mb-4">
                                <label className="font-medium mb-2 block">Exercise</label>
                                <Controller
                                    name={`exercises.${exerciseIndex}.exercise`}
                                    control={control}
                                    rules={{required: 'Please select an exercise'}}
                                    render={({field}) => {
                                        // Get the selected category for this exercise
                                        const selectedCategory = watch(`exercises.${exerciseIndex}.category`);
                                        // Get exercises for this category
                                        const availableExercises = selectedCategory
                                            ? getExercisesForCategory(selectedCategory.value)
                                            : [];

                                        return (
                                            <Select
                                                {...field}
                                                options={availableExercises}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isSearchable={true}
                                                placeholder={selectedCategory
                                                    ? "Search or select an exercise..."
                                                    : "Please select a category first"}
                                                isDisabled={!selectedCategory}
                                                // Clear exercise selection when category changes
                                                value={selectedCategory ? field.value : null}
                                                onChange={(newValue) => {
                                                    field.onChange(newValue);
                                                    // Reset sets when exercise changes
                                                    setValue(`exercises.${exerciseIndex}.sets`, []);
                                                }}
                                            />
                                        );
                                    }}
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
                                        <Plus size={16}/>Add Set
                                    </button>
                                </div>

                                {/* Headers */}
                                <div className="flex gap-4 items-center p-2">
                                    <span className="font-medium text-sm w-10 text-center">Set #</span>
                                    <div className="flex-1 pl-2">
                                        <label className="label-text">Weight (lbs)</label>
                                    </div>
                                    <div className="flex-1 pl-2">
                                        <label className="label-text">Reps</label>
                                    </div>
                                    <label className="label-text">Copy/Delete</label>
                                </div>

                                {(watch(`exercises.${exerciseIndex}.sets`) || []).map((set, setIndex) => (
                                    <div key={setIndex} className={`flex gap-4 items-center mb-2 p-2 ${
                                        set.weight && set.reps
                                            ? 'bg-base-200 bg-opacity-50 rounded-md'
                                            : ''
                                    }`}>
                                        <span className="font-medium text-center text-sm w-10">{setIndex + 1}</span>
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                className="input input-sm input-bordered w-full"
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
                                                className="input input-sm input-bordered w-full"
                                                placeholder="Reps"
                                                {...register(`exercises.${exerciseIndex}.sets.${setIndex}.reps`, {
                                                    required: "Reps are required",
                                                    min: {value: 1, message: "At least 1 rep required"},
                                                    max: {value: 999, message: "Too many reps"}
                                                })}
                                            />
                                        </div>
                                        <div className="flex gap-2 w-18">
                                            {/* Copy set */}
                                            <button
                                                type="button"
                                                className="btn btn-square btn-sm"
                                                onClick={() => {
                                                    const currentSets = watch(`exercises.${exerciseIndex}.sets`);
                                                    const setToCopy = currentSets[setIndex];
                                                    // Only copy if the set has values
                                                    if (setToCopy.weight && setToCopy.reps) {
                                                        setValue(`exercises.${exerciseIndex}.sets`, [
                                                            ...currentSets,
                                                            { weight: setToCopy.weight, reps: setToCopy.reps }
                                                        ]);
                                                    }
                                                }}
                                            >
                                                <Copy size={16} />
                                            </button>
                                            {/* Delete set */}
                                            <button
                                                type="button"
                                                className="btn btn-square btn-error btn-sm"
                                                onClick={() => {
                                                    const currentSets = watch(`exercises.${exerciseIndex}.sets`);
                                                    setValue(
                                                        `exercises.${exerciseIndex}.sets`,
                                                        currentSets.filter((_, idx) => idx !== setIndex)
                                                    );
                                                }}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(watch(`exercises.${exerciseIndex}.sets`) || []).length === 0 ? (
                                    <p className="text-error text-xs mt-1">Please add at least one set</p>
                                ) : !validateSets(watch(`exercises.${exerciseIndex}.sets`)) && (
                                    <p className="text-error text-xs mt-1">Please enter weight and reps for each set</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Exercise Button */}
                <div className="text-center">
                    <button
                        type="button"
                        className="btn btn-outline mb-6 lg:btn-wide"
                        onClick={() => append({exercise: null, sets: [], notes: ''})}
                    >
                        <Plus size={16} />Add Another Exercise
                    </button>
                </div>

                {/* Exercise Notes */}
                {selectedCategory && (
                    <div className="mb-6">
                        <label className="font-medium mb-2 block">Workout Notes</label>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Add notes for this workout..."
                            {...register('notes')}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary w-full mt-5"
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