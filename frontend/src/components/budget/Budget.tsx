import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TransactionContext from "../../context/TransactionContext";
import type { Budget as BudgetType } from "../../types/Budget";
import "../../styles/Budget.css";

function Budget() {
    const { totalExpense, selectedDate } = useContext(TransactionContext)!;
    const [budget, setBudget] = useState<BudgetType | null>(null);

    // Fetch budget for the selected month/year when selecteDate changes
    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const month = selectedDate.getMonth() + 1;
                const year = selectedDate.getFullYear();
                const response = await axios.get(
                    `http://localhost:3000/budget/budget?month=${month}&year=${year}`,
                    { withCredentials: true }
                );
                setBudget(response.data);
            } catch (error) {
                console.error("Failed to fetch budget:", error);
                setBudget(null);
            }
        };

        fetchBudget();
    }, [selectedDate]);

    // If no budget is set for the selected month, display a message with a link to create a budget
    if (!budget) {
        return (
            <div className="goal-container">
                <p>No budget set for this month.</p>
                <Link to="/create-budget" className="button primary-button mt-2" title="create budget">
                    Create Budget
                </Link>
            </div>
        );
    }

    const difference = budget.targetAmount - totalExpense;
    const isOverBudget = difference < 0;
    // If user has a budget set for the selected month, display the difference between the total expenses and the budget target amount
    return (
        <div className="budget-widget">
            <p>
                You are <strong>${Math.abs(difference).toFixed(2)} </strong>
                <span className={isOverBudget ? "over-budget" : "under-budget"}>
                    {isOverBudget ? "Over" : "Under"} Budget
                </span> 
            </p>
            <Link to="/edit-budget" className="button primary-button mt-2" title="edit budget">
                Edit Budget
            </Link>
        </div>
    );
}
export default Budget;