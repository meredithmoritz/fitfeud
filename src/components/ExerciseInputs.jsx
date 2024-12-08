import React from "react";
import { useFormContext } from "react-hook-form";
import { Copy, Plus, X } from "lucide-react";
import { exerciseCategories } from '../utils/exerciseTypes';

export const ExerciseInputs = ({ exerciseIndex, exercise }) => {
    const { register, watch, setValue, formState: { errors } } = useFormContext();

    const validateSets = (sets) => {
        if (!sets || sets.length === 0) {
            return false;
        }
        return sets.every(set => set.weight && set.reps);
    };

    // Don't show anything until an exercise is selected
    if (!exercise?.category) return null;

    const type = exerciseCategories[exercise.category];
    if (!type) return null;

    // For exercises that don't use sets
    if (!type.requiresSets) {
        return (
            <div className="mb-4">
                {type.fields.map(field => (
                    <div key={field} className="mb-2">
                        <label className="font-medium mb-2 block">{type.labels[field]}</label>
                        <input
                            type="number"
                            className="input input-bordered w-full"
                            {...register(`exercises.${exerciseIndex}.${field}`,
                                type.validation[field]
                            )}
                        />
                        {errors.exercises?.[exerciseIndex]?.[field] && (
                            <p className="text-error text-sm mt-1">
                                {errors.exercises[exerciseIndex][field].message}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // For exercises that use sets (strength, plyometrics)
    return (
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
                                        {weight: setToCopy.weight, reps: setToCopy.reps}
                                    ]);
                                }
                            }}
                        >
                            <Copy size={16}/>
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
                            <X size={18}/>
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
    );
};