import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "../../styles/forms/AuthForms.css";

function Login({ setUser }: { setUser: (user: any) => void }) {
    // Pass setUser as a prop
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

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
                    withCredentials: true, // Send cookies with the request
                }
            );

            console.log("Success:", response.data);

            if (response.data.success) {
                console.log(response.data.user);
                setUser(response.data.user); // Update the user state
                // Redirect to the homepage
                navigate("/");
                window.location.reload();
            } else {
                console.log("Login Failed: ", response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error message:", error.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    return (
        <section className="form-page">
            <div className="form-container">
                <h1>Login</h1>
                <div className="form-error-container"></div>

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
                        <button type="submit" className="button primary-button">
                            Login
                        </button>
                    </div>
                </form>
                <h3>- OR -</h3>
                <button className="google-btn">GOOGLE LOGIN</button>
            </div>
        </section>
    );
}

export default Login;
