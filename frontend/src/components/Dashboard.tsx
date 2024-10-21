import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "./DatePicker";

interface DashboardProps {
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

function Dashboard({ selectedDate, setSelectedDate }: DashboardProps) {
   
    return (
        <section className="dashboard-page">
            <div className="header-container">
                <div className="header">
                    <h1 id="transactions-title">
                        <span>Month/Year</span> Overview
                    </h1>
                </div>
                <div className="calendar-button-container">
              <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </div>
            </div>

            <div className="goal-container"></div>

            <div className="breakdown-container">
                <p>Total Expenses for Month</p>
                <div className="graph-container">
               
                </div>
                <div className="categories-list"></div>
            </div>
        </section>
    );
}

export default Dashboard;
