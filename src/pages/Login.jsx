import React, { useState } from 'react'
import { signIn } from '../functions/auth';
import { useForm } from 'react-hook-form';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const onSubmit = async (data) => {
        setAuthError('');
        setIsLoading(true);

        try {
            const result = await signIn(data.email, data.password);
            if (result instanceof Error) {
                // Handle specific Firebase auth errors
                switch (result.code) {
                    case 'auth/user-not-found':
                        setAuthError('No account exists with this email.');
                        break;
                    case 'auth/wrong-password':
                        setAuthError('Incorrect password.');
                        break;
                    case 'auth/invalid-credential':
                        setAuthError('Invalid email or password.');
                        break;
                    case 'auth/too-many-requests':
                        setAuthError('Too many failed attempts. Please try again later.');
                        break;
                    default:
                        setAuthError('An error occurred during login.');
                }
            }
        } catch (error) {
            console.error("Error signing in: ", error);
            setAuthError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <form id="loginForm" className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-3xl font-bold mb-10">Log in</h1>

                {authError && (
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
                        <span>{authError}</span>
                    </div>
                )}

                <label id="loginEmailLabel"
                       htmlFor="loginEmail"
                       className="form-control mb-1 text-sm font-medium">
                    Email
                </label>
                <input
                    id="loginEmailInput"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.email ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'}`}
                    placeholder="Email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Please enter a valid email"
                        }
                    })}
                    onChange={() => setAuthError('')}
                />
                {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}

                <label id="loginPasswordLabel"
                       htmlFor="loginPassword"
                       className="block mb-2 text-sm font-medium text-gray-900 mt-3">
                    Password
                </label>
                <input
                    id="loginPasswordInput"
                    type="password"
                    placeholder="Password"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.password ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'}`}
                    {...register("password", {
                        required: "Please enter a password"
                    })}
                    onChange={() => setAuthError('')}
                />
                {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}

                <div className="text-center">
                    <button
                        type="submit"
                        id="loginButton"
                        disabled={isLoading}
                        className={`btn btn-primary w-full mt-6 center lg:btn-wide ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Logging in...
                            </>
                        ) : (
                            'Log in'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}