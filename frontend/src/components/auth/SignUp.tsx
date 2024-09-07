import { useState } from "react";

interface LoginFormState {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}
function Signup() {
    const [values, setValues] = useState<LoginFormState>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    return (
        <section className="form-page">
            <div className="form-container">
                <h1>Sign Up</h1>
                <div className="form-error-container"></div>

                <form className="signup-form" action="" method="POST">
                    <div className="form-group">
                        <label>First Name:</label>
                        <input type="text" placeholder="John" required />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input type="text" placeholder="Doe" required />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" placeholder="someEmail@gmail.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" placeholder="Password" required />
                    </div>

                    <div className="form-btn-wrapper">
                        <button type="submit" className="btn btn-primary">
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
