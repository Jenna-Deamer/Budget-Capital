import "../styles/Dashboard.css";
import { useContext } from "react";
import DatePicker from "./DatePicker";
import TransactionContext from "../context/TransactionContext";
import Budget from "./budget/Budget";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

function Dashboard() {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const {
        totalIncome,
        totalExpense,
        incomeCategories,
        expenseCategories,
        selectedDate,
        setSelectedDate,
    } = useContext(TransactionContext)!;

    // Extract month and year from selected date for displaying in the header
    const selectedMonth = selectedDate.toLocaleString("default", {
        month: "long",
    });
    const selectedYear = selectedDate.getFullYear();

    const categoryColors: string[] = [
        "#ff6347", // Tomato
        "#4682b4", // SteelBlue
        "#32cd32", // LimeGreen
        "#ff4500", // OrangeRed
        "#ffd700", // Gold
        "#8a2be2", // BlueViolet
        "#d2691e", // Chocolate
        "#ff1493", // DeepPink
        "#1e90ff", // DodgerBlue
        "#adff2f", // GreenYellow
        "#ff8c00", // DarkOrange
        "#6a5acd", // SlateBlue
        "#00fa9a", // MediumSpringGreen
        "#ff7f50", // Coral
        "#4b0082", // Indigo
        "#f0e68c", // Khaki
        "#ff00ff", // Fuchsia
        "#800000", // Maroon
        "#b22222", // Firebrick
        "#228b22", // ForestGreen
        "#ffb6c1", // LightPink
        "#20b2aa", // LightSeaGreen
        "#f4a300", // Orange
        "#483d8b", // DarkSlateBlue
        "#ffdead", // NavajoWhite
    ];
    const options = {
        plugins: {
            legend: {
                display: false
            }
        }
    };

    const incomeDataChart = {
        labels: Object.keys(incomeCategories),
        datasets: [{
            data: Object.values(incomeCategories),
             // Use the categoryColors array and map it to the categories, repeating colors if needed
            backgroundColor: Object.keys(incomeCategories).map((_, index) => categoryColors[index % categoryColors.length]),
            borderColor: "rgba(255, 255, 255, 0.75)",
            borderWidth: 1,
        }],
    }

    const expenseDataChart = {
        labels: Object.keys(expenseCategories),
        datasets: [{
            data: Object.values(expenseCategories),
              // Use the categoryColors array and map it to the categories, repeating colors if needed
            backgroundColor: Object.keys(expenseCategories).map((_, index) => categoryColors[index % categoryColors.length]),
            borderColor: "rgba(255, 255, 255, 0.75)",
            borderWidth: 1,
        }],
    }

    return (
        <div className="dashboard-page">
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

            <section className="highlight-container">
                <div className="highlight-box">
                    <strong>${totalIncome.toFixed(2)}</strong>
                    <p className="income-label">Income</p>
                </div>
                <Budget />
                <div className="highlight-box">
                    <strong>${totalExpense.toFixed(2)}</strong>
                    <p className="expense-label">Expense</p>
                </div>
            </section>

            <section className="breakdown-section">
                <div className="breakdown-container">
                    <p>Total Expenses</p>
                    <div className="graph-container">
                    <Pie data={expenseDataChart} options={options} className="responsive-pie-chart" />

                    </div>
                    <div className="categories-list-container">
                        <ul className="category-breakdown">
                            {Object.entries(expenseCategories).map(
                                ([category, total], index) => {
                                    const percentage = totalExpense
                                        ? (
                                              (total / totalExpense) *
                                              100
                                          ).toFixed(2)
                                        : "0.00";
                                    const categoryColor =
                                        index < categoryColors.length
                                            ? categoryColors[index] // Use color from categoryColors if within range
                                            : "#000000"; // Default to black if there are not enough colors
                                    return (
                                        <li key={category}>
                                            <span className="category">
                                                <i
                                                    className="bi bi-circle-fill"
                                                    style={{
                                                        color: categoryColor,
                                                    }}
                                                ></i>
                                                {category}
                                            </span>
                                            <span> ${total.toFixed(2)}</span>
                                            <span> {percentage}%</span>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>
                </div>

                <div className="breakdown-container mt-4">
                    <p>Total Income</p>
                    <div className="graph-container">
                    <Pie data={incomeDataChart} options={options} className="responsive-pie-chart" />
                    </div>
                    <div className="categories-list-container">
                        <ul className="category-breakdown">
                            {Object.entries(incomeCategories).map(
                                ([category, total], index) => {
                                    const percentage = totalExpense
                                        ? (
                                              (total / totalExpense) *
                                              100
                                          ).toFixed(2)
                                        : "0.00";
                                    const categoryColor =
                                        index < categoryColors.length
                                            ? categoryColors[index] // Use color from categoryColors if within range
                                            : "#000000"; // Default to black if there are not enough colors
                                    return (
                                        <li key={category}>
                                            <span className="category">
                                                <i
                                                    className="bi bi-circle-fill me-1"
                                                    style={{
                                                        color: categoryColor,
                                                    }}
                                                ></i>
                                                {category}
                                            </span>
                                            <span> ${total.toFixed(2)}</span>
                                            <span> {percentage}%</span>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
