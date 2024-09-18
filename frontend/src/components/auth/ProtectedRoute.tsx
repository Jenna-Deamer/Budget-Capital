import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    user: any;
    children: React.ReactNode;
}

function ProtectedRoute({ user, children }: ProtectedRouteProps) {
    if (!user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" />;
    }

    // If user is authenticated, render the children
    return <>{children}</>;
}

export default ProtectedRoute;