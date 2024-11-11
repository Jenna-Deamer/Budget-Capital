import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface BudgetFormData {
    amount: string;
    month: string;
    year: string;
}

function CreateBudget() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<BudgetFormData>({
        amount: "",
        month: new Date().getMonth() + 1 + "", // Current month
        year: new Date().getFullYear() + "", // Current year
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
            // Format data to match backend expectations
            const budgetData = {
                amount: parseFloat(formData.amount),
                month: formData.month,
                year: parseInt(formData.year),
            };

            const response = await axios.post(
                "http://localhost:3000/budget/create-budget",
                budgetData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                navigate("/dashboard");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error(
                    "Failed to create budget:",
                    error.response.data.message
                );
                // Handle error message display to user here
            } else {
                console.error("Failed to create budget:", error);
            }
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
                <h1 className="text-center pb-2">Create Budget</h1>

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

                    <button type="submit" className="primary-button button">
                        Create Budget
                    </button>
                </form>
            </article>
        </section>
    );
}

export default CreateBudget;
