import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/forms/AuthForms.css";
import { User } from "../../types/User";

function Login({ setUser }: { setUser: (user: User) => void }) {
    const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [formError, setFormError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_URL}/auth/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                localStorage.setItem("jwtToken", response.data.token);
                setUser(response.data.user); // Set the user data after successful login
                navigate("/dashboard");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message ||
                    "An error occurred. Please try again.";
                setFormError(errorMessage);
            } else {
                setFormError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <section className="form-page">
            <div className="form-container">
                <h1>Login</h1>
                <div className="form-error-container">
                    {formError && (
                        <p className="error-message text-center">{formError}</p>
                    )}
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="someEmail@gmail.com"
                            name="username"
                            onChange={handleChange}
                            value={formData.username}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            name="password"
                            value={formData.password}
                            required
                        />
                    </div>
                    <div className="form-btn-wrapper">
                        <button
                            type="submit"
                            className="button primary-button me-2"
                        >
                            Login
                        </button>
                        <Link
                            to="/demoLogin"
                            className="button secondary-button"
                        >
                            Demo user
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Login;
