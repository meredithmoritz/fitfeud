import React from 'react'
import { UserAuth } from "../context/AuthContext";

export default function UserDashboard() {
    const { user } = UserAuth();

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