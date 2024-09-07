import React, { useState } from 'react';

const Login: React.FC = () => {
    const [response, setResponse] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const result = await res.json();
            setResponse(JSON.stringify(result));
        } catch (error) {
            setResponse('Error: ' + (error as Error).message);
        }
    };

    return (
        <div>
            <h1>Test POST /resources</h1>
            <form onSubmit={handleSubmit}>
                <button type="submit">Send POST Request</button>
            </form>
            <div>{response}</div>
        </div>
    );
};

export default Login;