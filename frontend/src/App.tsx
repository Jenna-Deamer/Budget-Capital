import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";

// Views
import LandingPage from "./components/LandingPage";
import Transactions from "./components/Transactions";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";

// Shared
import NavBar from "./components/shared/NavBar";
import Footer from "./components/shared/Footer";
// Forms
import CreateTransaction from "./components/transactions/Create";
// Libraries
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";

interface User {
    username: string;
}

function App() {
    // User state
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                localStorage.removeItem("token");
                setUser(null);
            } else {
                setUser(decoded);
            }
        } else {
            console.log("No token found");
        }
        setLoading(false);
    }, []);

    function LocationListener() {
        const location = useLocation();

        useEffect(() => {}, [location]);

        return null;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <LocationListener />
            <div className="app-container">
                <NavBar user={user} />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<LandingPage user={user} />} />
                        <Route
                            path="/transactions"
                            element={
                                <ProtectedRoute user={user}>
                                    <Transactions />
                                </ProtectedRoute>
                            }
                        />
                        {!user ? (
                            <>
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/login" element={<Login />} />
                            </>
                        ) : (
                            <>
                                <Route
                                    path="/signup"
                                    element={<Navigate to="/" />}
                                />
                                <Route
                                    path="/login"
                                    element={<Navigate to="/" />}
                                />
                            </>
                        )}
                        <Route
                            path="/create-transaction"
                            element={
                                <ProtectedRoute user={user}>
                                    <CreateTransaction />
                                </ProtectedRoute>
                            }
                        />
                        {/* Catch-all route for undefined routes */}
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
