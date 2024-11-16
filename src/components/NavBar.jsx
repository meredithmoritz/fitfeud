import React from 'react';
import { Link, useNavigate} from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { logOut } from '../functions/auth.js';

const NavBar = () => {
    const { user } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            console.log("Attempting to log out...");
            await logOut();
            console.log("Logout successful, navigating home...");
            navigate('/');
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <nav className="navbar bg-base-100 border-b border-gray-200 mb-8">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    fitfeud
                </Link>
                {user && (
                    <Link to="/workouts" className="btn btn-ghost normal-case text-md ml-4">
                        Workouts
                    </Link>
                )}
            </div>
            <div className="flex-none gap-2">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Profile" />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to="/profile">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="text-left">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <button
                            className="btn btn-primary ml-2"
                            onClick={() => navigate('/login')}
                        >
                            Log in
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/create-user')}
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;