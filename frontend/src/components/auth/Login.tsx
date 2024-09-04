import { useState } from "react";

interface LoginFormState {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

function Login() {
    const [values, setValues] = useState<LoginFormState>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        } catch (error) {}
    };
    return (
        <>
            <form action=""></form>
        </>
    );
}

export default Login;
