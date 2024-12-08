import React, { useState } from 'react';
import { useForm, useFieldArray, Controller, FormProvider } from 'react-hook-form'; // Add Controller
import Select from 'react-select';
import exercises from '../data/exercises.json';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { createWorkout } from '../functions/workouts';
import { ExerciseInputs } from '../components/ExerciseInputs';
import { exerciseCategories } from '../utils/exerciseTypes';
import { Plus, X } from 'lucide-react';

const organizedExercises = exercises.reduce((acc, exercise) => {
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

// get exercises for a selected category
const categoryOptions = Object.entries(exerciseCategories).map(([value, category]) => ({
    value,
    label: category.label,
    icon: category.icon
}));

const CreateWorkout = () => {
    const navigate = useNavigate();
    const { user } = UserAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    // Create form methods
    const methods = useForm({
        defaultValues: {
            exercises: [{ exercise: null, sets: [] }],
            notes: ''
        }
    });

    const { control, handleSubmit, formState: { errors }, watch, register } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "exercises"
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError(null);
        try {
            // Create user workout doc
            const workoutData = {
                exercises: data.exercises.map(exercise => ({
                    exerciseId: exercise.exercise.value,
                    exerciseName: exercise.exercise.label,
                    category: exercise.category.value,
                    // Adapt this based on exercise type
                    ...(exerciseCategories[exercise.category.value].requiresSets
                            ? {
                                sets: exercise.sets.map(set => ({
                                    weight: parseFloat(set.weight),
                                    reps: parseInt(set.reps)
                                }))
                            }
                            : {
                                duration: parseFloat(exercise.duration),
                                distance: exercise.distance ? parseFloat(exercise.distance) : null
                            }
                    )
                })),
                notes: data.notes || ''
            };
            await createWorkout(workoutData, user.uid);
            navigate('/workouts');
        } catch (error) {
            console.error('Error creating workout:', error);
            setServerError('Failed to create workout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
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
                                                options={categoryOptions}
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
                                        rules={{
                                            required: 'Please select an exercise',
                                            validate: {
                                                hasRequiredData: (value) => {
                                                    const exerciseType = exerciseCategories[value.category];
                                                    if (!exerciseType) return true;

                                                    // For exercises that require sets
                                                    if (exerciseType.requiresSets) {
                                                        const sets = watch(`exercises.${exerciseIndex}.sets`);
                                                        if (!sets || sets.length === 0) return "Please add at least one set";

                                                        // Check if all required fields are filled
                                                        return sets.every(set =>
                                                            exerciseType.fields.every(field => set[field])
                                                        ) || "Please complete all set fields";
                                                    }

                                                    // For exercises that don't use sets, check required fields
                                                    return exerciseType.fields
                                                            .filter(field => exerciseType.validation[field]?.required)
                                                            .every(field => watch(`exercises.${exerciseIndex}.${field}`))
                                                        || "Please complete all required fields";
                                                }
                                            }
                                        }}
                                        render={({field}) => {
                                            const selectedCategory = watch(`exercises.${exerciseIndex}.category`);
                                            const availableExercises = selectedCategory
                                                ? organizedExercises[selectedCategory.value] || []
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
                                                    value={selectedCategory ? field.value : null}
                                                    onChange={(newValue) => {
                                                        field.onChange(newValue);
                                                        // Reset sets when exercise changes
                                                        methods.setValue(`exercises.${exerciseIndex}.sets`, []);
                                                    }}
                                                />
                                            );
                                        }}
                                    />

                                    {/* Show exercise inputs only after exercise is selected */}
                                    {watch(`exercises.${exerciseIndex}.exercise`) && (
                                        <ExerciseInputs
                                            exerciseIndex={exerciseIndex}
                                            exercise={watch(`exercises.${exerciseIndex}.exercise`)}
                                        />
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
                            <Plus size={16}/>Add Another Exercise
                        </button>
                    </div>

                    {/* Exercise Notes */}
                    <div className="mb-6">
                        <label className="font-medium mb-2 block">Workout Notes</label>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Add notes for this workout..."
                            {...register('notes')}
                        />
                    </div>

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
        </FormProvider>
    );
};

export default CreateWorkout;