import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { logOut } from '../functions/auth'

const NavBar = () => {
    const { user, logout } = UserAuth();

    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/create-account');
    };

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 mt-2">
                            <img src="/logo.png" alt="Logo"/>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="/"
                               className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                Home
                            </a>
                            <a href="/create-user"
                               className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                Create User
                            </a>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => navigate('/login')}
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
