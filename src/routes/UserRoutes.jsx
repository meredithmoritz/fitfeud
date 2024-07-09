import React from 'react'
import { Route, Routes } from "react-router-dom"
import UserDashboard from "../pages/UserDashboard";
import NavBar from "../components/NavBar";
import Home from "../pages/Home";
import Login from "../pages/Login";

export default function UserRoutes() {
    return (
        <div>
            <NavBar>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/*" element={<Home/>} />
                </Routes>
            </NavBar>
            <UserDashboard />
        </div>
    )
}