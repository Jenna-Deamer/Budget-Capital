import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LogoutProps {
    setUser: (user: null) => void;
}

function Logout({ setUser }: LogoutProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3000/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );

            console.log(response.data);
            if (response.status === 200) {
                setUser(null); // Clear the user state
                navigate("/"); // Redirect to the homepage
                window.location.reload();
            } else {
                console.error("Logout failed:", response.data.message);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-link nav-link">
            Logout
        </button>
    );
}

export default Logout;
