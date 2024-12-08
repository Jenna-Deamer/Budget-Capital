import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../types/User";

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken"); // Ensure the token key matches what's stored

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Verify token by calling the backend
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/check-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected route children
  return <>{children}</>;
};

export default ProtectedRoute;
