import { BicepsFlexed, Dumbbell, HeartPulse, Sun } from "lucide-react";

export const exerciseCategories = {
    strength: {
        label: "Strength/Lifting",
        value: 'strength',
        icon: Dumbbell,
        requiresSets: true,
        fields: ['weight', 'reps'],
        labels: {
            weight: 'Weight (lbs)',
            reps: 'Reps'
        },
        validation: {
            weight: {
                required: "Weight is required",
                min: { value: 0, message: "Weight must be positive" },
                max: { value: 9999, message: "Weight too high" }
            },
            reps: {
                required: "Reps are required",
                min: { value: 1, message: "At least 1 rep required" },
                max: { value: 999, message: "Too many reps" }
            }
        }
    },
    cardio: {
        label: "Cardio",
        value: 'cardio',
        icon: HeartPulse,
        requiresSets: false,
        fields: ['duration', 'distance'],
        labels: {
            duration: 'Duration (mins)',
            distance: 'Distance (optional)',
        },
        validation: {
            duration: {
                required: "Duration is required",
                min: { value: 1, message: "Duration must be at least 1 minute" }
            },
            distance: {
                min: { value: 0, message: "Distance must be positive" }
            }
        }
    },
    plyometrics: {
        label: "Plyometrics",
        value: 'plyometrics',
        icon: BicepsFlexed,
        requiresSets: true,
        fields: ['reps'],
        labels: {
            reps: 'Reps'
        },
        validation: {
            reps: {
                required: "Reps are required",
                min: { value: 1, message: "At least 1 rep required" }
            }
        }
    },
    stretching: {
        label: "Stretching",
        value: 'stretching',
        icon: Sun,
        requiresSets: false,
        fields: [],
        labels: {},
        validation: {}
    }
};