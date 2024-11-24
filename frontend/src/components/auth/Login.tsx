import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import "../../styles/forms/AuthForms.css";
import { User } from "../../types/User";

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

function Login({ setUser }: LoginProps) {
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
                "http://localhost:3000/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                setUser(response.data.user);
                navigate("/");
                window.location.reload();
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

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:3000/auth/google";
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
                <h3>- OR -</h3>
                <div className="button-container">
                <GoogleButton
                    onClick={handleGoogleLogin}
                    label="Sign in with Google"
                />
                </div>
              
            </div>
        </section>
    );
}

export default Login;
