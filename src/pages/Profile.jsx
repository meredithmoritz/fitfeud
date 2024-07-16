import React from 'react'
import NavBar from "../components/NavBar";
import {UserAuth} from "../context/AuthContext";

export default function Profile () {
    const { user } = UserAuth();


    return (
        <div className="m-5">
            <h4 className="text-2xl font-bold dark:text-white">User Profile</h4>
            <div id="profileFirstNam" className="">First Name: {user.firstName}</div>
            <div id="profileFirstNam" className="">Last Name: {user.lastName}</div>
        </div>
    )
}
