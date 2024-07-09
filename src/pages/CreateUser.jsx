import React, { useState } from 'react';
import { signUp } from "../functions/auth.js";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useForm } from "react-hook-form";

export default function CreateUser () {
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const { email, username, firstName, lastName, password, confirmPassword } = data;
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const userData = {
                email: email,
                username: username,
                firstName: firstName,
                lastName: lastName,
            };
            await signUp(email, password, userData);
            alert("User " + firstName + " created successfully!");
            navigate('/');
        } catch (error) {
            alert("Error creating user: " + error.message);
        }
    };

    return (
        <>
            <NavBar />
            <h1 className="text-3xl font-bold text-center mb-12">Register</h1>

            <form onSubmit={handleSubmit(onSubmit)} id="registrationForm" className="max-w-sm mx-auto">

                {/* Email: Required */}
                <label id="regEmaiLabel" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                    id="regEmailInput"
                    className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    {...register("email", {
                        required: "Please enter a valid email",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Please enter a valid email"
                        }
                    })}
                />
                {errors.email && <p id="emailErrorMessage" className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.email.message}</p>}

                {/* Username: Required */}
                <label id="regUserNameLabel" className="block mt-2 mb-1 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input
                    id="regUserNameInput"
                    className={`bg-gray-50 border ${errors.username ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    type="text"
                    placeholder="Username"
                    {...register("username", {
                        required: "Please enter a username",
                        pattern: {
                            value: /^[a-zA-Z0-9-]+$/,
                            message: "Username can only contain letters, numbers, and hyphens",},
                        minLength: { value: 4, message: "Username must be at least 4 characters" },
                        maxLength: { value: 30, message: "Username must be shorter than 30 characters" }})}
                />
                {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.username.message}</p>}

                {/* First Name: Required */}
                <label className="block mt-2 mb-1 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                <input
                    className={`bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    type="text"
                    placeholder="First Name"
                    {...register("firstName", { required: "Please enter a first name" })}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.firstName.message}</p>}

                {/* Last Name: Optional */}
                <label className="block mt-2 mb-1 text-sm font-medium text-gray-900 dark:text-white">Last Name (Optional)</label>
                <input
                    className={`bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName")}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.lastName.message}</p>}

                {/* Password: Required */}
                <label className="block mt-2 mb-1 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                    className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                        required: "Please enter a password",
                        minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                />
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.password.message}</p>}

                {/* Confirm Password: Required */}
                <label className="block mt-2 mb-1 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                <input
                    className={`bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", { required: "Please confirm your password" })}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.confirmPassword.message}</p>}

                <button
                    className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="submit"
                >
                    Register
                </button>
            </form>
        </>
    );
}