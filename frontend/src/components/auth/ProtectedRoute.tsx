import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { User } from '../../types/User';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}
interface DecodedToken {
  userId: string;
  exp: number;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get the token from localStorage
  const token = localStorage.getItem("jwtToken"); // Ensure token key matches what's stored

  // If there's no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode the token to check its expiration
  let decodedToken: DecodedToken | null = null;
  try {
    decodedToken = jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }

  // Check if the token has expired
  const currentTime = Date.now() / 1000; // Current time in seconds
  if (!decodedToken || decodedToken.exp < currentTime) {
    console.log("Token has expired");
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the children (protected route)
  return <>{children}</>;
}

export default ProtectedRoute;
