import { Link } from "react-router-dom";

function Transactions() {
    return (
        <section className="transactions-page">
            <h1>Transactions CRUD Page</h1>
            <Link
                to="/create-transaction"
                className="nav-link"
                id="transactions"
            >
                Transactions
            </Link>
        </section>
    );
}

export default Transactions;
