import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/forms/AuthForms.css";

interface User {
    id: string;
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
                    "http://localhost:3000/auth/login",
                    demoCredentials,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                if (response.data.success) {
                    console.log(response.data.user);
                    setUser(response.data.user);
                    navigate("/transactions");
                    window.location.reload();
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
                    setFormError(errorMessage);
                } else {
                    setFormError("An unexpected error occurred. Please try again.");
                }
            }
        };

        loginAsDemoUser();
    }, [navigate, setUser]); 

    return (
        <section className="form-page">
            <div className="form-container">
                <h1>Logging in as Demo User...</h1>
                {formError && <p className="error-message text-center">{formError}</p>}
            </div>
        </section>
    );
}

export default DemoLogin;
