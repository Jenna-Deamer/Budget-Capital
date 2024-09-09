import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [response, setResponse] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:3000/login', {
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
                console.log("Login Failed: ", response.data.message )
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
                <h1>Login</h1>
                <div className="form-error-container"></div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            placeholder="someEmail@gmail.com" 
                            name="username"   
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            name="password" 
                            
                            required />
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
};

export default Login;