import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BudgetFormData } from "../../types/Budget";

function CreateBudget() {
    const API_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const navigate = useNavigate();
    const [formData, setFormData] = useState<BudgetFormData>({
        id: "",
        amount: "",
        month: (new Date().getMonth() + 1).toString(), // Current month
        year: new Date().getFullYear().toString(), // Current year
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
            const token = localStorage.getItem("jwtToken");
            console.log(
                "Token from localStorage:",
                token ? "Token exists" : "No token"
            ); // Debug

            if (!token) {
                navigate("/login");
                return;
            }

            const budgetData = {
                amount: parseFloat(formData.amount),
                month: parseInt(formData.month),
                year: parseInt(formData.year),
            };

            // console.log("Sending budget data:", budgetData); // Debug
            // console.log("Authorization header:", `Bearer ${token}`); // Debug

            const response = await axios.post(
                `${API_URL}/budget/create-budget`,
                budgetData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // console.log("Response:", response.data); // Debug

            if (response.status === 201) {
                navigate("/dashboard");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Full error response:", error.response); // Debug: Full error details
                const errorMessage =
                    error.response?.data?.message || "Failed to create budget";
                console.error(errorMessage);
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
    const years = Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);

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
