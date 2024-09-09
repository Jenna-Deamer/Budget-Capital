import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:3000/signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Success:', response.data);

            if (response.data.success) {
                // Redirect to the homepage
                navigate('/');
            }
            else{
                console.log("Signup Failed: ", response.data.message )
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error message:', error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <section className="form-page">
            <div className="form-container">
                <h1>Sign Up</h1>
                <div className="form-error-container"></div>

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
                            required />
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
