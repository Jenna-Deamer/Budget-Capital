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
    // Extract month and year from selected date for displaying in the header
    const selectedMonth = selectedDate.toLocaleString("default", {
        month: "long",
    });
    const selectedYear = selectedDate.getFullYear();

    //calculate total expense & income
    const totalIncome = transactions
        .filter((transaction) => transaction.type.toLowerCase() === "income")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalExpense = transactions
        .filter((transaction) => transaction.type.toLowerCase() === "expense")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    // get all categories & their totals
    const incomeCategories: { [key: string]: number } = {};
    const expenseCategories: { [key: string]: number } = {};
    // loop through transactions and add to categories object
    transactions
        .filter((transaction) => transaction.type.toLowerCase() === "expense")
        .forEach((transaction) => {
            // if category exists, add amount to category total
            if (expenseCategories[transaction.category]) {
                expenseCategories[transaction.category] += transaction.amount;
            } else {
                // if category does not exist, create category and set amount as initial value
                expenseCategories[transaction.category] = transaction.amount;
            }
        });

    transactions
        .filter((transaction) => transaction.type.toLowerCase() === "income")
        .forEach((transaction) => {
            // if category exists, add amount to category total
            if (incomeCategories[transaction.category]) {
                incomeCategories[transaction.category] += transaction.amount;
            } else {
                // if category does not exist, create category and set amount as initial value
                incomeCategories[transaction.category] = transaction.amount;
            }
        });

    return (
        <section className="dashboard-page">
            <div className="header-container">
                <div className="header">
                    <h1 id="dashboard-title">
                        {selectedMonth} {selectedYear} Overview
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
                    <p>${totalIncome}</p>
                    <p className="income-label">Income</p>
                </div>
                <div className="goal-container">
                    <p>You are <strong>$99999.99</strong> <span className="expense-label"> Over Budget!</span></p>
                    <button className="button primary-button mt-2">Manage Goal</button>
                </div>
                <div className="highlight-box">
                    <strong>${totalExpense}</strong>
                    <p className="expense-label">Expense</p>
                </div>
            </div>

            <div className="breakdown-container">
                <p>Total Expenses for Month</p>
                <div className="graph-container">
                    
                </div>
                <div className="categories-list-container">
                    <ul className="expense-category-breakdown">
                        {Object.entries(expenseCategories).map(([category, total]) => {
                            const percentage = totalExpense ? ((total / totalExpense) * 100).toFixed(2) : "0.00";
                            return (
                                <li key={category}>
                                    <span> {category}</span>
                                    <span> ${total}</span>
                                    <span> {percentage}%</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
