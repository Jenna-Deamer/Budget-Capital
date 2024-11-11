import { Link } from "react-router-dom";
import totalCalculator from "../TotalsCalculator ";

// Define the Budget type
interface Budget {
    _id: string;
    targetAmount: number;
    actualAmount: number;
    month: string;
    year: number;
}

interface BudgetProps {
    hasBudget: boolean;
    budget: Budget | null;
    totalExpense: number;
}

function Budget({ hasBudget, budget, totalExpense }: BudgetProps) {
    // Calculate difference between target & actual expense
    const difference = budget ? budget.targetAmount - totalExpense : 0;
    const isOverBudget = difference < 0;

    return (
        <div className="goal-container">
            {hasBudget ? (
                <p>
                    You are <strong>${Math.abs(difference).toFixed(2)}</strong>
                    <span
                        className={
                            isOverBudget ? "expense-label" : "income-label"
                        }
                    >
                        {isOverBudget ? " Over Budget!" : " Under Budget!"}
                    </span>
                </p>
            ) : (
                <p>No budget set for this month</p>
            )}
            <Link
                to={hasBudget ? "/edit-budget" : "/create-budget"}
                className="button primary-button mt-2"
                title={hasBudget ? "edit budget" : "create budget"}
            >
                {hasBudget ? "Edit Budget" : "Create Budget"}
            </Link>
        </div>
    );
}

export default Budget;
