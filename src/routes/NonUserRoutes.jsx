import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import CreateUser from "../pages/CreateUser";
import Login from "../pages/Login";

export default function NonUserRoutes() {
    return (
        <div>
            <Routes>
                {/* Routes for users who are not logged in: */}
                <Route path="/" element={<Home />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<Home />} /> {/* Fallback to Home */}
            </Routes>
        </div>
    )
}