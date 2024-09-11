import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow">
    <Link to="/" className="navbar-brand mx-4" id="home" title="Go to Homepage">
      <img
        src=""
        alt="Logo Placeholder"
      />
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
        <li className="nav-item">
          <Link to="/transactions" className="nav-link" id="transactions">
            Transactions
          </Link>
        </li>
        <li className="nav-item">
          <p className="nav-link">Hello, </p>
        </li>
      </ul>
    </div>
  </nav>
  );
}

export default NavBar;