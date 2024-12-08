import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// Import Types
import { BudgetFormData } from "../../types/Budget";

function EditBudget() {
    const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const location = useLocation();
    const { budget } = location.state;
    const navigate = useNavigate();

    const [formData, setFormData] = useState<BudgetFormData>({
        amount: budget.targetAmount.toString(),
        month: budget.month.toString(),
        year: budget.year.toString(),
        id: budget._id,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log("Form data before submit:", formData);

            const response = await axios.put(
                `${API_URL}/budget/edit-budget`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            console.log("Success:", response.data);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Generate month options using Date API
    const months = Array.from({ length: 12 }, (_, index) => {
        return new Date(2000, index, 1).toLocaleString("default", {
            month: "long",
        });
    });

    // Generate year options (current year + next 5 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

    return (
        <section className="crud-page-wrapper">
            <article className="crud-form-container">
                <h1 className="text-center pb-2">Edit Budget</h1>
                <form className="crud-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-control"
                            id="amount"
                            name="amount"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="month">Month</label>
                        <select
                            className="form-control"
                            id="month"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                        >
                            {months.map((month, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <select
                            className="form-control"
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="primary-button button me-3"
                    >
                        Edit Budget
                    </button>
                </form>
            </article>
        </section>
    );
}

export default EditBudget;
