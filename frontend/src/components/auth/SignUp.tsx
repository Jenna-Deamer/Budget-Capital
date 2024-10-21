import React, { useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../../styles/forms/AuthForms.css";

function Signup() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
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
        // Validate password length
        if (formData.password.length < 8) {
            setFormError("Password must be at least 8 characters long.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:3000/auth/signup",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Success:", response.data);

            if (response.data.success) {
                navigate("/login");
            } else {
                console.log("Signup Failed: ", response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // error message returned from the backend
                const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
                setFormError(errorMessage);  // Set the error message to display to the user
            } else {
                setFormError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <section className="form-page">
            <div className="form-container">
                <h1>Sign Up</h1>
                <div className="form-error-container">
                    {formError && <p className="error-message text-center">{formError}</p>}
                </div>
                <p className="text-center">Don't want to create an account?  <Link to="/login"  id="demo-link">Login as a Demo Account</Link></p>


                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            placeholder="John"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            placeholder="Doe"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="someEmail@gmail.com"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            min={8}
                            required
                        />
                    </div>

                    <div className="form-btn-wrapper">
                        <button type="submit" className="button primary-button">
                            Sign Up
                        </button>
                    </div>
                </form>
                <h3>- OR -</h3>
                <button className="google-btn">GOOGLE SIGN-IN</button>
            </div>
        </section>
    );
}

export default Signup;
