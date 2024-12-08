import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
    const navigate = useNavigate();
    const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const handleLogout = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            localStorage.removeItem("jwtToken");

            console.log(response.data);
            if (response.status === 200) {
                navigate("/"); // Redirect to the homepage
                window.location.reload();
            } else {
                console.error("Logout failed:", response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error message:", error.message);
            } else {
                console.error("Unexpected error during logout", error);
            }
        }
    };

    return (
        <button onClick={handleLogout} className="logout-btn nav-link">
            Logout
        </button>
    );
}

export default Logout;
