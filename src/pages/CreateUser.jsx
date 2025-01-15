import { signUp } from "../functions/auth.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import React, { useState } from "react";

export default function CreateUser () {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    const { register, handleSubmit, watch, formState: { errors }, setError } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError(null);

        const { email, username, firstName, lastName, password } = data;

        try {
            const userData = {
                email,
                username,
                firstName,
                lastName,
            };

            await signUp(email, password, userData);
            navigate('/');
        } catch (error) {
            console.error("Registration error:", error);

            // Handle specific Firebase errors
            if (error.code === 'auth/email-already-in-use') {
                setError('email', {
                    type: 'manual',
                    message: 'This email is already registered'
                });
            } else if (error.message.includes('username')) { // If you add username uniqueness check
                setError('username', {
                    type: 'manual',
                    message: 'This username is already taken'
                });
            } else {
                setServerError(error.message || "An error occurred during registration");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} id="registrationForm" className="max-w-sm mx-auto">
                <h1 data-testid="register-header" className="text-3xl font-bold mb-10">Register</h1>

                {serverError && (
                    <div role="alert" className="alert alert-error text-xs p-2 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>{serverError}</span>
                    </div>
                )}

                {/* Email: Required */}
                <label id="regEmaiLabel" className="form-control mb-1 text-sm font-medium">Email</label>
                <input
                    id="regEmailInput"
                    data-testid="register-email"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.email ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'}`}
                    placeholder="you@gmail.com"
                    {...register("email", {
                        required: "Please enter a valid email",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Please enter a valid email"
                        }
                    })}
                />
                {errors.email && <p id="emailErrorMessage"
                                    className="mt-1 text-xs text-error dark:text-error">{errors.email.message}</p>}

                {/* Username: Required */}
                <label id="regUsernameLabel"
                       className="form-control mb-1 text-sm font-medium mt-3">Username</label>
                <input
                    id="regUsernameInput"
                    data-testid="register-username"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.username ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'}`}
                    type="text"
                    placeholder="Username"
                    {...register("username", {
                        required: "Please enter a username",
                        pattern: {
                            value: /^[a-zA-Z0-9-]+$/,
                            message: "Username can only contain letters, numbers, and hyphens",
                        },
                        validate: {
                            minMaxLength: value =>
                                (value.length >= 6 && value.length <= 30) ||
                                "Username must be between 6-30 characters",
                            noSpaces: value =>
                                !value.includes(" ") ||
                                "Username cannot contain spaces",
                            validStart: value =>
                                /^[a-zA-Z]/.test(value) ||
                                "Username must start with a letter",
                            noConsecutiveHyphens: value =>
                                !/--/.test(value) ||
                                "Username cannot contain consecutive hyphens"
                        }
                    })}
                />
                {errors.username && <p className="mt-1 text-xs text-error">{errors.username.message}</p>}

                {/* First Name: Required */}
                <label className="form-control mb-1 text-sm font-medium mt-3">First Name</label>
                <input
                    data-testid="register-firstname"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.firstName ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'} `}
                    type="text"
                    placeholder="First Name"
                    {...register("firstName", {
                        required: "Please enter a first name",
                        maxLength: {value: 30, message: "First names must be shorter than 30 characters"}
                    })}
                />
                {errors.firstName && <p className="mt-1 text-xs text-error">{errors.firstName.message}</p>}

                {/* Last Name: Optional */}
                <label className="form-control mb-1 text-sm font-medium mt-3">Last Name
                    (Optional)</label>
                <input
                    data-testid="register-lastname"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.lastName ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'} `}
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName", {
                        maxLength: {value: 30, message: "Last names must be shorter than 30 characters"}
                    })}
                />
                {errors.lastName && <p className="mt-1 text-xs text-error">{errors.lastName.message}</p>}

                {/* Password: Required */}
                <label className="form-control mb-1 text-sm font-medium mt-3">Password</label>
                <input
                    data-testid="register-password"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.password ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'}`}
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                        required: "Please enter a password",
                        minLength: {value: 6, message: "Passwords must be between 6-30 characters"},
                        maxLength: {value: 30, message: "Passwords must be between 6-30 characters"}
                    })}
                />
                {errors.password &&
                    <p className="mt-1 text-xs text-error dark:text-error">{errors.password.message}</p>}

                {/* Confirm Password: Required */}
                <label className="form-control mb-1 text-sm font-medium mt-3">Confirm Password</label>
                <input
                    data-testid="register-confirmpassword"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.confirmPassword ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'} `}
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: value => value === password || "Passwords do not match"}
                    )}
                />
                {errors.confirmPassword &&
                    <p className="mt-1 text-xs text-error dark:text-error">{errors.confirmPassword.message}</p>}

                <div className="text-center">
                <button
                    data-testid="register-submit"
                    id="registerButton"
                    className="btn btn-primary w-full mt-6 text-center lg:btn-wide"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner"></span>
                            Registering...
                        </>
                    ) : (
                        "Register"
                    )}
                </button>
                </div>
            </form>
        </>
    );
}