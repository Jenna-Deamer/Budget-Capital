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
    console.log(transactions.map((transaction) => transaction.type));
    console.log(transactions.map((transaction) => transaction.amount));

    //calcuate total expense & income
    const totalIncome = transactions
        .filter((transaction) => transaction.type.toLowerCase() === "income")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalExpense = transactions
        .filter((transaction) => transaction.type.toLowerCase() === "expense")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    console.log("total income " + totalIncome);
    console.log("total expense " + totalExpense);
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
                <div className="categories-list"></div>
            </div>
        </section>
    );
}

export default Dashboard;
