import { Link } from "react-router-dom";
import type { Budget } from "../../types/Budget";
import { Transaction } from "../types/Transaction";


function Budget () {
    // Calculate difference between target & actual expense
    // const difference = budget ? budget.targetAmount - totalExpense : 0;
    // const isOverBudget = difference < 0;

    return (
        <div className="goal-container">
          <p>You are <strong>$200.00</strong> Over Budget</p>
            <Link
                to="/create-budget"
                className="button primary-button mt-2"
                title="create budget"
            >
                Create Budget
            </Link>
        </div>
    );
}

export default Budget;