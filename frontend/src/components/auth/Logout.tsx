import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/logout',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                // Clear token from localstorage
                localStorage.removeItem('token');
                // Redirect to the homepage
                navigate('/');
                window.location.reload();
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error message:', error.message);
            } else {
                console.error('Unexpected error during logout', error);
            }
        }
    };

    return (
        <button onClick={handleLogout} className="button primary-button">
            Logout
        </button>
    );
}

export default Logout;