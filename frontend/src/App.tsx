import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";

// Views
import LandingPage from "./components/LandingPage";
import Transactions from "./components/Transactions";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";

// Shared
import NavBar from "./components/shared/NavBar";
import Footer from "./components/shared/Footer";

// Libraries
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

interface User {
    username: string;
}

function App() {
    // User state
    const [user, setUser] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            console.log(decoded);

            if (decoded.exp < currentTime) {
                localStorage.removeItem("token");
            } else {
                setUser(decoded);
            }
        } else {
            console.log("No token found");
        }
    }, [location]);
    return (
        <BrowserRouter>
            <div>
                <NavBar user={user} />
                <main>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route
                            path="/transactions"
                            element={<Transactions />}
                        />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
