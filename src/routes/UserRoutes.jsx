import React from 'react'
import { Route, Routes } from "react-router-dom"
import UserDashboard from "../pages/UserDashboard";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

export default function UserRoutes() {
    return (
        <div>
                <Routes>
                    {/* Routes for logged-in users: */}
                    <Route path="/" element={<UserDashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/*" element={<UserDashboard />} /> {/* Fallback to UserDashboard */}
                </Routes>
        </div>
    )
}