import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    return (
        <section className="dashboard-page">
            <div className="header-container">
                <div className="header">
                    <h1 id="transactions-title">
                        <span>Month/Year</span> Overview
                    </h1>
                </div>
                <div className="calendar-button-container">
                    <button
                        className="secondary-button button"
                        title="Change month/year"
                    >
                        Change Date <i className="bi bi-calendar-fill"></i>
                    </button>
                </div>
            </div>

            <div className="goal-container"></div>

            <div className="breakdown-container">
                <p>Total Expenses for Month</p>
                <div className="graph-container"></div>
                <div className="categories-list"></div>
            </div>
        </section>
    );
}

export default Dashboard;
