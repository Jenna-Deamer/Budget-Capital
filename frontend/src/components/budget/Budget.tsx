import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TransactionContext from "../../context/TransactionContext";
import type { Budget as BudgetType } from "../../types/Budget";
import "../../styles/Budget.css";

function Budget() {
    const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const { totalExpense, selectedDate } = useContext(TransactionContext)!;
    const [budget, setBudget] = useState<BudgetType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const month = selectedDate.getMonth() + 1;
                const year = selectedDate.getFullYear();

                console.log("Fetching budget for:", { month, year });

                const response = await axios.get(
                    `${API_URL}/budget/budget?month=${month}&year=${year}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Map API response to expected format
                const budgetData = {
                    ...response.data,
                    targetAmount: parseFloat(response.data.amount) || 0,
                };

                console.log("Fetched budget:", budgetData);

                if (!isNaN(budgetData.targetAmount)) {
                    setBudget(budgetData);
                } else {
                    console.error(
                        "Invalid budget targetAmount:",
                        response.data.targetAmount
                    );
                    setBudget(null);
                }
            } catch (error) {
                console.error("Failed to fetch budget:", error);
                setBudget(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBudget();
    }, [selectedDate]);

    if (loading) {
        return (
            <div className="budget-widget">
                <p>Loading...</p>
            </div>
        );
    }

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your budget for this month?"
        );
        if (confirmed) {
            try {
                const month = selectedDate.getMonth() + 1;
                const year = selectedDate.getFullYear();

                const response = await axios.delete(
                    `${API_URL}/budget/budget?month=${month}&year=${year}`,
                    { withCredentials: true }
                );
                if (response.status === 200) {
                    setBudget(null);
                }
            } catch (error) {
                console.error("Failed to delete budget:", error);
            }
        }
    };

    // If no budget is set for the selected month, display a message with a link to create a budget
    if (!budget) {
        return (
            <div className="budget-widget">
                <p>No budget set for this month.</p>
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

    const difference = budget.targetAmount - totalExpense;
    const isOverBudget = difference < 0;
    // If user has a budget set for the selected month, display the difference between the total expenses and the budget target amount
    return (
        <div className="budget-widget">
            <p>
                You are <strong>${Math.abs(difference).toFixed(2)} </strong>
                <span className={isOverBudget ? "over-budget" : "under-budget"}>
                    {isOverBudget ? "Over" : "Under"}&nbsp;Budget
                </span>
            </p>
            <div className="button-container mt-3">
                <Link
                    to={`/edit-budget/${budget._id}`}
                    state={{ budget }}
                    className="button primary-button"
                    title="edit budget"
                >
                    Edit Budget
                </Link>
                <button
                    type="button"
                    className="danger-button button ms-3"
                    onClick={handleDelete}
                >
                    Delete Budget
                </button>
            </div>
        </div>
    );
}

export default Budget;
