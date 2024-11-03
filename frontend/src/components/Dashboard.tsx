import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "./DatePicker";

interface Transaction {
    _id: string;
    name: string;
    type: string;
    amount: number;
    category: string;
    date: string;
    formattedDate?: string;
}

interface DashboardProps {
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
    transactions: Transaction[];
}

function Dashboard({
    selectedDate,
    setSelectedDate,
    transactions,
}: DashboardProps) {
    //calcuate total expense & income
    const totalIncome = transactions
        .filter((transaction) => transaction.type.toLowerCase() === "income")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalExpense = transactions
        .filter((transaction) => transaction.type.toLowerCase() === "expense")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    // get all categories & their totals
    const categories: { [key: string]: number } = {};
    // loop through transactions and add to categories object
    transactions
        .filter((transaction) => transaction.type.toLowerCase() === "expense")
        .forEach((transaction) => {
            // if category exists, add amount to category total
            if (categories[transaction.category]) {
                categories[transaction.category] += transaction.amount;
            } else {
                // if category does not exist, create category and set amount as initial value
                categories[transaction.category] = transaction.amount;
            }
        });
    return (
        <section className="dashboard-page">
            <div className="header-container">
                <div className="header">
                    <h1 id="transactions-title">
                        <span>Month/Year</span> Overview
                    </h1>
                </div>
                <div className="calendar-button-container">
                    <DatePicker
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                </div>
            </div>

            <div className="highlight-container">
                <div className="highlight-box">
                    <p>Income</p>
                    <p>${totalIncome}</p>
                </div>
                <div className="goal-container"></div>
            </div>
            <div className="highlight-box">
                <p>Expense</p>
                <p>${totalExpense}</p>
            </div>
            <div className="breakdown-container">
                <p>Total Expenses for Month</p>
                <div className="graph-container"></div>
                <div className="categories-list">
                    <ul>
                        {Object.entries(categories).map(([category, total]) => (
                            <li key={category}>
                                <span>{category}</span>
                                <span>${total}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
