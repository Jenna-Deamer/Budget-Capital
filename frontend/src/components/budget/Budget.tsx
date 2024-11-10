import { Link } from "react-router-dom";

function Goal() {
    return (
        <div className="goal-container">
            <p>
                You are <strong>$99999.99</strong>{" "}
                <span className="expense-label"> Over Budget!</span>
            </p>
            <Link
                to="/create-budget"
                className="button primary-button mt-2"
                title="create budget"
            >
                Create Goal
            </Link>
        </div>
    );
}

export default Goal;
