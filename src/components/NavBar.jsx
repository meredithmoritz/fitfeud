import React from 'react';
import { Link, useNavigate} from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { logOut } from '../functions/auth.js';
import { LuUserCircle2 } from "react-icons/lu";

const NavBar = () => {
    const { user } = UserAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            console.log("Attempting to log out...");
            await logOut();
            console.log("Logout successful, navigating to login page...");

            // Ensure user state is updated before navigating
            if (!user) {
                navigate('/');
            } else {
                console.error("User state not updated correctly.");
            }
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <>
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
                            <Link to="/workout-log"
                               className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                Workout Log
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <>
                            <Link to="/profile" className="text-gray-900 inline-flex items-center px-1 pt-1 text-md font-medium mr-2">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>

                                {user.firstName}
                            </Link>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => navigate('/login')}
                                >
                                    Log in
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-1"
                                    onClick={() => navigate('/create-user')}
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
        </>
    );
}

export default NavBar;
