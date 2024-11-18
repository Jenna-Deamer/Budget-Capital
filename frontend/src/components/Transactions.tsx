import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Transactions.css";
import DatePicker from "./DatePicker";
import axios from "axios";
import TransactionContext from "../context/TransactionContext"; 
import { Transaction } from "../types/Transaction";


function Transactions() {
  // Use transaction context to set transactions & date
  const { transactions, setTransactions, selectedDate, setSelectedDate } = useContext(TransactionContext)!; 
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Extract month & year from date for displaying in header
  const selectedMonth = selectedDate.toLocaleString("default", { month: "long" });
  const selectedYear = selectedDate.getFullYear();

  const handleDelete = async (transactionId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3000/transaction/delete-transaction/${transactionId}`);
        setTransactions(transactions.filter((transaction) => transaction._id !== transactionId));
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    }
  };

  const handleSorting = (sortType: keyof Transaction) => {
    const nextSortOrder = sortOrder === "asc" ? "desc" : "asc";

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (nextSortOrder === "asc") {
        return a[sortType] < b[sortType] ? -1 : 1;
      } else {
        return a[sortType] > b[sortType] ? -1 : 1;
      }
    });

    setTransactions(sortedTransactions);
    setSortOrder(nextSortOrder);
  };

  return (
    <div className="transactions-page">
      <section className="header-container">
        <div className="header">
          <h1 id="transactions-title">{`${selectedMonth} ${selectedYear} Transactions`}</h1>
        </div>
        <div className="calendar-button-container">
          <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
      </section>

      <section className="table-section">
        <div className="table-buttons mt-3">
          <Link
            to="/create-transaction"
            className="primary-button button me-3"
            id="transactions"
            title="Create transaction"
          >
            Create
          </Link>
        </div>
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>
                  Amount{" "}
                  <button onClick={() => handleSorting("amount")}>
                    Sort {sortOrder === "asc" ? "▲" : "▼"}
                  </button>
                </th>
                <th>Category</th>
                <th>
                  Date{" "}
                  <button onClick={() => handleSorting("date")}>
                    Sort {sortOrder === "asc" ? "▲" : "▼"}
                  </button>
                </th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.name}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.amount.toFixed(2)}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.formattedDate}</td>
                  <td className="button-cell">
                    <Link
                      to={`/edit-transaction/${transaction._id}`}
                      state={{ transaction }}
                      className="edit-button table-button"
                      id="edit-button"
                      title="Edit transaction"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                  </td>
                  <td className="button-cell">
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="delete-button table-button"
                      id="delete-button"
                      title="Delete transaction"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Transactions;
