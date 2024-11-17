import React from 'react'
import { Route, Routes } from "react-router-dom"
import UserDashboard from "../pages/UserDashboard";
import Profile from "../pages/Profile";
import WorkoutLog from "../pages/WorkoutLog";
import CreateWorkout from "../pages/CreateWorkout";

export default function UserRoutes() {
    return (
        <div>
                <Routes>
                    {/* Routes for logged-in users: */}
                    <Route path="/" element={<UserDashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/workouts" element={<WorkoutLog />} />
                    <Route path="/workouts/add" element={<CreateWorkout />} />
                    <Route path="/*" element={<UserDashboard />} /> {/* Fallback to UserDashboard */}
                </Routes>
        </div>
    )
}