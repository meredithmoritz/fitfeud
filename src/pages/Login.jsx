import React, { useState } from 'react'
import { signIn } from '../functions/auth';
import NavBar from "../components/NavBar";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [loginError, setLoginError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault();
        setEmailError(false);
        setPasswordError(false);
        setLoginError('');

        if (!email) {
            setEmailError(true);
        }
        if (!password) {
            setPasswordError(true);
        }
        if (email && password) {
            try {
                await signIn(email, password);
            } catch (error) {
                console.error("Error signing in: ", error);
            }
        }
    }
    return (
        <div>
            <NavBar/>
            <form id="loginForm" className="max-w-sm mx-auto">
                <div className="mb-5">
                    <label htmlFor="loginEmail"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email"
                           id="loginEmail"
                           placeholder="Email"
                           className={`bg-gray-50 border ${emailError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                           onChange={(e) => {
                               setEmail(e.target.value);
                               if (emailError) {
                                   setEmailError(false);
                               }
                           }
                           }/>
                    {!emailError ? <p className="hidden"></p> : <p className="mt-2 text-sm text-red-600 dark:text-red-500">Email is required!</p> }
                </div>
                <div className="mb-5">
                <label htmlFor="loginPassword"
                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password"
                           id="loginPassword"
                           placeholder="Password"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           onChange={(e) => {
                               setPassword(e.target.value);
                           }}/>
                </div>
                <div className="flex items-start mb-5">
                    <button
                        id="loginButton"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleLogin}>Login
                    </button>
                </div>
            </form>
        </div>
)
}
