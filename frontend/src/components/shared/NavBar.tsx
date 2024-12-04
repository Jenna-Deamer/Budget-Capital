import { Link } from "react-router-dom";
import LogoutButton from "../auth/Logout";

interface User {
    id: string;
    username: string | null;
    firstName: string;
    lastName: string;
}
interface NavBarProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

function NavBar({ user }: NavBarProps) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow">
            <Link
                to="/"
                className="navbar-brand mx-3"
                id="home"
                title="Go to Homepage"
            >
                <img src="/images/logo.png" alt="Logo placeholder" />
            </Link>

            <button
                className="navbar-toggler me-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon custom-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {user && (
                        <>
                            <li className="nav-item">
                                <Link
                                    to="/transactions"
                                    className="nav-link"
                                    id="transactions"
                                >
                                    Transactions
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/dashboard"
                                    className="nav-link"
                                    id="dashboard"
                                >
                                    Dashboard
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Right-aligned username and auth buttons */}
                <ul className="navbar-nav ms-auto me-4">
                    {user ? (
                        <>
                            <li className="nav-item username-nav">
                                <span>Welcome, {user.firstName}</span>
                            </li>
                            <li className="nav-item">
                                <LogoutButton />
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item auth-item">
                                <Link
                                    to="/login"
                                    className="nav-link"
                                    id="login"
                                >
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item me-2 auth-item">
                                <Link
                                    to="/signup"
                                    className="nav-link"
                                    id="signup"
                                >
                                    Sign-up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
