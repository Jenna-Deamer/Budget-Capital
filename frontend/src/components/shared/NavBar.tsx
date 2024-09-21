import { Link } from "react-router-dom";

interface User {
    username: string | null;
}

interface NavBarProps {
    user: User | null;
}

function NavBar({ user }: NavBarProps) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow">
            <Link
                to="/"
                className="navbar-brand mx-4"
                id="home"
                title="Go to Homepage"
            >
                <img src="" alt="Logo Placeholder" />
            </Link>

            <button
                className="navbar-toggler me-2"
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
                <ul className="navbar-nav ms-3">
                    {user && (
                        <li className="nav-item">
                            <Link
                                to="/transactions"
                                className="nav-link"
                                id="transactions"
                            >
                                Transactions
                            </Link>
                        </li>
                    )}
                    <li className="nav-item">
                        {user ? (
                            <p className="usernameNav">
                                Welcome, {user.username}
                            </p>
                        ) : (
                            <p className="usernameNav">Please log in</p>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
