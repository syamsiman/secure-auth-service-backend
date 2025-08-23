//import useContext
import React, { useContext } from 'react';

//import context
import { AuthContext } from '../context/AuthContext';

//import react router dom
import { Routes, Route, Navigate } from "react-router";

//import view home
import Home from "../views/home/index.jsx";

//import view register
import Register from "../views/auth/register.jsx";

//import view login
import Login from "../views/auth/login.jsx";
import Dashboard from '../views/user/Dashboard.jsx';

export default function AppRoutes() {

    //destructure context "isAuthenticated"
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Routes>
            {/* route "/" */}
            <Route path="/" element={<Home />} />

            {/* route "/register" */}
            <Route path="/register" element={
                isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Register />
            } />

            {/* route "/login" */}
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Login />
            } />

            {/* route "/dashboard" */}
            <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
    );
}