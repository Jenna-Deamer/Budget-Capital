import { Link } from "react-router-dom";
import "../styles/Transactions.css";
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
interface TransactionsProps {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

function Transactions({ selectedDate, setSelectedDate }: TransactionsProps) {
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Extract month and year from selected date for displaying in the header
  const selectedMonth = selectedDate.toLocaleString('default', { month: 'long' });
  const selectedYear = selectedDate.getFullYear();


  useEffect(() => {
    const fetchUserId = async () => {
      try {
        axios.defaults.withCredentials = true;
        console.log("Fetching user ID...");
        const response = await axios.get(
          "http://localhost:3000/auth/current-user"
        );
        if (response.data) {
          setUserId(response.data.userId);
          console.log("User ID:", response.data.userId);
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userId) {
        try {
          //Extract month and year from selected date to send to the backend
          const selectedMonth = selectedDate.getMonth() + 1; // getMonth() is zero-indexed, so add 1
          const selectedYear = selectedDate.getFullYear();

          const response = await axios.get(
            `http://localhost:3000/transaction/transactions?userId=${userId}&month=${selectedMonth}&year=${selectedYear}`,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          // Format the date for each transaction
          const formattedTransactions = response.data.map(
            (transaction: Transaction) => {
              return {
                ...transaction,
                formattedDate: new Date(transaction.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                ),
              };
            }
          );

          setTransactions(formattedTransactions);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        }
      }
    };
    fetchTransactions();
  }, [userId, selectedDate]);

  const handleDelete = async (transactionId: string) => {
    //popup message to confirm deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmed) {
      try {
        await axios.delete(
          `http://localhost:3000/transaction/delete-transaction/${transactionId}`
        );
        setTransactions(
          transactions.filter(
            (transaction) => transaction._id !== transactionId
          )
        ); // Remove the deleted transaction from state
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    }
  };

  return (
    <div className="transactions-page">
      <div className="header-container">
        <div className="header">
          <h1 id="transactions-title">
            <span>{selectedMonth} {selectedYear}</span> Transactions
          </h1>
        </div>
        <div className="calendar-button-container">
          <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
      </div>

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
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
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
                      state={{ transaction }} // Pass transaction data as state
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
              {transactions.length === 0 && ( // Render when there are no transactions
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
