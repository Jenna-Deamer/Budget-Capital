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
        <form>
            <label>Email</label>
            <input type="email" placeholder="someEmail@gmail.com" />
            <label>First Name:</label>
            <input type="text" placeholder="John" />
            <label>Last Name:</label>
            <input type="text" placeholder="Doe" />
            <label>Password</label>
            <input type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default Signup;
