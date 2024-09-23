import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../styles/forms/TransactionCreate.css";

const CreateTransaction = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        amount: 0,
        type: "",
        category: "",
        date: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/create-transaction",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Success:", response.data);

            if (response.data.success) {
                // Redirect to the homepage
                navigate("/transactions");
            } else {
                console.log("Creation Failed: ", response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error message:", error.message);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    return (
        <section className="crud-page-wrapper">
            <article className="crud-form-container">
                <h1 className="text-center pb-2">Create Transaction</h1>

                <form className="crud-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            id="amount"
                            name="amount"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select
                            className="form-control"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            className="form-control"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Housing">Housing</option>
                            <option value="Food">Food</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Transportation">
                                Transportation
                            </option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Education">Education</option>
                            <option value="Debt Payments">Debt Payments</option>
                            <option value="Personal Care">Personal Care</option>
                            <option value="Taxes">Taxes</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-button-wrapper">
                        <button type="submit" className="button primary-button">
                            Create
                        </button>
                    </div>
                </form>
            </article>
        </section>
    );
};

export default CreateTransaction;
