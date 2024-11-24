import React from "react";
import { Navigate } from "react-router-dom";
import User from "../../App.tsx";

interface ProtectedRouteProps {
    user: typeof User;
    children: React.ReactNode;
}

function ProtectedRoute({ user, children }: ProtectedRouteProps) {
    console.log("checking for user", user);
    if (user === null) {
        console.log("user is null");
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" />;
    }

    // If user is authenticated, render the children
    return <>{children}</>;
}

export default ProtectedRoute;
