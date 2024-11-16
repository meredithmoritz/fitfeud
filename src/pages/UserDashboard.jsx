import React from 'react'
import { UserAuth } from "../context/AuthContext";

export default function UserDashboard() {
    const context = UserAuth();
    if (!context) {
        return null; // or a loading spinner
    }

    const { user } = context;

    return (
        <div className="m-5">
            {user ? (
                <div>Welcome {user?.firstName}!</div>
            ) : (
                <div>Welcome!</div>
            )}
        </div>
    );
}