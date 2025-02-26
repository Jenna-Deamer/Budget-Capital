import { useEffect, useState } from "react";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Views
import LandingPage from "./components/LandingPage";
import Transactions from "./components/Transactions";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import DemoLogin from "./components/auth/DemoLogin";
import ManageCategories from "./components/transactions/categories/ManageCategories";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";

// Shared
import NavBar from "./components/shared/NavBar";
import Footer from "./components/shared/Footer";
// Forms
import CreateTransaction from "./components/transactions/Create";
import EditTransaction from "./components/transactions/Edit";
import CreateBudget from "./components/budget/Create";
import EditBudget from "./components/budget/Edit";
// Context
import { TransactionProvider } from "./context/TransactionContext";
import {CategoryProvider} from "./context/CategoryContext";
// Types
import { User } from "./types/User";

function App() {
    const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status on component mount
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await axios.get(`${API_URL}/auth/check-auth`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.user) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching auth status:", error);
                setUser(null);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 250);
            }
        };

        fetchAuthStatus();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <span className="loader"></span>
            </div>
        );
    }

    return (
        <CategoryProvider>
        <TransactionProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <BrowserRouter>
                    <div className="app-container">
                        <NavBar user={user} />
                        <main className="main-content">
                            <Routes>
                                <Route
                                    path="/"
                                    element={<LandingPage user={user} />}
                                />
                                <Route
                                    path="/transactions"
                                    element={
                                        <ProtectedRoute user={user}>
                                            <Transactions />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute user={user}>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                {!user ? (
                                    <>
                                        <Route
                                            path="/signup"
                                            element={<SignUp />}
                                        />
                                        <Route
                                            path="/login"
                                            element={
                                                <Login setUser={setUser} />
                                            }
                                        />
                                        <Route
                                            path="/demoLogin"
                                            element={
                                                <DemoLogin setUser={setUser} />
                                            }
                                        />
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
                                <Route
                                    path="/edit-transaction/:id"
                                    element={
                                        <ProtectedRoute user={user}>
                                            <EditTransaction />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/create-budget"
                                    element={
                                        <ProtectedRoute user={user}>
                                            <CreateBudget />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/edit-budget/:id"
                                    element={
                                        <ProtectedRoute user={user}>
                                            <EditBudget />
                                        </ProtectedRoute>
                                    }
                                />
                                    <Route
                                    path="/categories"
                                    element={
                                        <ProtectedRoute user={user}>
                                            <ManageCategories />
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
            </LocalizationProvider>
        </TransactionProvider>
        </CategoryProvider>
    );
}

export default App;
