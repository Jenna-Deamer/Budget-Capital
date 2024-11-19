import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/forms/AuthForms.css";

interface User {
    username: string;
    email: string;
}

function DemoLogin({ setUser }: { setUser: (user: User) => void }) {
    const navigate = useNavigate();
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const loginAsDemoUser = async () => {
            const demoCredentials = {
                username: "demo@gmail.com",
                password: "demouser",
            };

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/login`, // Use the base URL from environment variables
                    demoCredentials,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                setUser(response.data.user);
                navigate("/dashboard");
            } catch (error) {
                console.error("Failed to login as demo user:", error);
                setFormError("Failed to login as demo user.");
            }
        };

        loginAsDemoUser();
    }, [navigate, setUser]);

    return (
        <div>
            {formError && <p>{formError}</p>}
            <p>Logging in as demo user...</p>
        </div>
    );
}

export default DemoLogin;
