import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/forms/AuthForms.css";

function Login({ setUser }: { setUser: (user: any) => void }) {
    // Pass setUser as a prop
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
                    withCredentials: true, // Send cookies with the request
                }
            );

            if (response.data.success) {
                console.log(response.data.user);
                setUser(response.data.user); // Update the user state
                // Redirect to the homepage
                navigate("/");
                window.location.reload();
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
                <h1>Login</h1>
                <div className="form-error-container">
                {formError && <p className="error-message text-center">{formError}</p>}
                </div>
                <p className="text-center">
  You can test the app using the demo account: 
  <br />
  Email: <strong>Demo@gmail.com</strong> Password: <strong>demouser</strong>
</p>

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
