import "./CreateTransaction.css";
import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const CreateTransaction = () => {
    return (
        <section className="form-page-wrapper">
            <article className="crud-form-container">
                <h1>Create Transaction</h1>

                {/* <div className="form-message-container">
                    <div className="form-message mb-2 errorPopup">
                        <h4>Please fill out all required fields</h4>
                    </div>
                    <div className="form-message mb-2 successPopup">
                        <h4 className="fade-out">Transaction created</h4>
                    </div>
                </div> */}

                <form className="crud-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            id="amount"
                            placeholder="Enter amount"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select className="form-control" id="type" required>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select className="form-control" id="category" required>
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
                            required
                        />
                    </div>
                    <div className="form-button-wrapper">
                        <button type="button" className="primary-button">
                            Create
                        </button>
                    </div>
                </form>
            </article>
        </section>
    );
};

export default CreateTransaction;
