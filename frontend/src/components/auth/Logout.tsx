import { useNavigate } from "react-router-dom";
import axios from "axios";


function Logout (){
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
