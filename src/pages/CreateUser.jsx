import { signUp } from "../functions/auth.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function CreateUser () {
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    // Watch the password field
    const password = watch("password");

    const onSubmit = async (data) => {
        const { email, username, firstName, lastName, password } = data;

        try {
            const userData = {
                email: email,
                username: username,
                firstName: firstName,
                lastName: lastName,
            };
            await signUp(email, password, userData);
            navigate('/');
        } catch (error) {
            alert("Error creating user: " + error.message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} id="registrationForm" className="max-w-sm mx-auto">
                <h1 className="text-3xl font-bold mb-12">Register</h1>

                {/* Email: Required */}
                <label id="regEmaiLabel" className="form-control mb-1 text-sm font-medium dark:text-white">Email</label>
                <input
                    id="regEmailInput"
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
                       className="form-control mb-1 text-sm font-medium dark:text-white mt-3">Username</label>
                <input
                    id="regUsernameInput"
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.username ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'}`}
                    type="text"
                    placeholder="Username"
                    {...register("username", {
                        required: "Please enter a username",
                        pattern: {
                            value: /^[a-zA-Z0-9-]+$/,
                            message: "Username can only contain letters, numbers, and hyphens",
                        },
                        minLength: {value: 4, message: "Usernames must be between 6-30 characters"},
                        maxLength: {value: 30, message: "Usernames must be between 6-30 characters"}
                    })}
                />
                {errors.username && <p className="mt-1 text-xs text-error">{errors.username.message}</p>}

                {/* First Name: Required */}
                <label className="form-control mb-1 text-sm font-medium dark:text-white mt-3">First Name</label>
                <input
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
                <label className="form-control mb-1 text-sm font-medium dark:text-white mt-3">Last Name
                    (Optional)</label>
                <input
                    className={`input input-sm block p-2.5 w-full max-w-sm ${errors.lastName ? 'input-error focus:input-error' : 'input-bordered focus:input-primary'} `}
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName", {
                        maxLength: {value: 30, message: "Last names must be shorter than 30 characters"}
                    })}
                />
                {errors.lastName && <p className="mt-1 text-xs text-error">{errors.lastName.message}</p>}

                {/* Password: Required */}
                <label className="form-control mb-1 text-sm font-medium dark:text-white mt-3">Password</label>
                <input
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
                <label className="form-control mb-1 text-sm font-medium dark:text-white mt-3">Confirm Password</label>
                <input
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

                <div className="registerButton text-center">
                <button
                    className="btn btn-primary w-full mt-6 center lg:btn-wide"
                    type="submit"
                >
                    Register
                </button>
                </div>
            </form>
        </>
    );
}