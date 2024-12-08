import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/forms/AuthForms.css";

interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

function DemoLogin({ setUser }: { setUser: (user: User) => void }) {
    const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const navigate = useNavigate();
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const loginAsDemoUser = async () => {
            const demoCredentials = {
                username: "demo123@demo.com",
                password: "demouser",
            };

            try {
                const response = await axios.post(
                    `${API_URL}/auth/login`,
                    demoCredentials,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                if (response.data.success) {
                    localStorage.setItem("jwtToken", response.data.token);
                    setUser(response.data.user);  // Set the user data after successful login
                    navigate("/transactions");
                    window.location.reload();
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage =
                        error.response?.data?.message ||
                        "An error occurred. Please try again.";
                    setFormError(errorMessage);
                } else {
                    setFormError(
                        "An unexpected error occurred. Please try again."
                    );
                }
            }
        };

        loginAsDemoUser();
    }, [API_URL, navigate, setUser]);

    return (
        <section className="form-page">
            <div className="form-container">
                <h1>Logging in as Demo User...</h1>
                {formError && (
                    <p className="error-message text-center">{formError}</p>
                )}
            </div>
        </section>
    );
}

export default DemoLogin;
