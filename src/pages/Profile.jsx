import React from 'react'
import {UserAuth} from "../context/AuthContext";

export default function Profile () {
    const { user, loading } = UserAuth();

    // Show loading text or spinner until user data is fetched
    if (loading) {
        return (
            <div role="status" className="max-w-sm animate-pulse">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    // Display user info if user is logged in
    if (user) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-8">Profile</h1>

                {/* User Details */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Name:</p>
                        <p className="text-xl">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Email:</p>
                        <p>{user?.email}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Username:</p>
                        <p>{user?.username}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">UID:</p>
                        <p>{user?.uid}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">User ID:</p>
                        <p>{user?.userId}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Account Created:</p>
                        <p>{user?.createdAt?.toDate().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Handle case where no user data is available
    return <p>No user data available.</p>;
}