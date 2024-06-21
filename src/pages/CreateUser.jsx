import React, { useState } from 'react'
import { signUp } from "../functions/auth.js";

export default function CreateUser () {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const userData = {
        firstName,
        lastName,
        email,
        password
    }

    const handleCreateUser = () => {
        if(password !== confirmPassword) {
            alert("Passwords don't match")
        } else if (!email) {
            alert("Email is required")
        } else if (!password) {
            alert("Password is required")
        } else if (!firstName) {
            alert("First name is required")
        } else if (!lastName) {
            alert("Last name is required")
        } else signUp(email, password, userData);
    }


    return (
        <>
        <h1 className="text-3xl font-bold text-center mb-12">Register</h1>
        <p>{firstName}</p>
        <div className="grid grid-cols-1 m-5 gap-4 max-w-5xl max-auto">
            <input type="text" placeholder="First Name"
            onChange={(e) => {
                setFirstName(e.target.value);
            }}/>
            <input type="text" placeholder="Last Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >Register</button>
        </div>
        </>
    )
}