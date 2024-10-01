import { Link } from "react-router-dom";
import "../styles/Transactions.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
    _id: string;
    name: string;
    type: string;
    amount: number;
    category: string;
    date: string; 
}

function Transactions() {
    const [userId, setUserId] = useState(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.get('http://localhost:3000/auth/current-user');
                console.log('Current User Response:', response.data); 
                if (response.data) {
                    setUserId(response.data.userId);
                    console.log('User ID:', response.data.userId);
                }
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            console.log('Fetching transactions for User ID:', userId);
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:3000/transaction/transactions?userId=${userId}`, {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    });                    
                    setTransactions(response.data);
                    console.log('Transactions:', response.data);
                } catch (error) {
                    console.error('Failed to fetch transactions:', error);
                }
            }
        };
        fetchTransactions();
    }, [userId]);
    

   
    return (
        <section className="transactions-page">
            <div className="header-container">
                <h1>Transactions CRUD Page</h1>
                <button className="primary-button button">September 2024</button>
            </div>
            <div className="table-wrapper">
                <div className="table-buttons">
                    <Link
                        to="/create-transaction"
                        className="primary-button button me-3"
                        id="transactions"
                    >
                        Create
                    </Link>
                    <Link
                        to="/create-transaction"
                        className="primary-button button"
                        id="transactions"
                    >
                        Sort By
                    </Link>
                </div>
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
                        {transactions.map((transaction: Transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction.name}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.date}</td>
                                <td className="button-cell">
                                    <Link
                                        to={`/edit-transaction/${transaction._id}`}
                                        className="edit-button table-button"
                                        id="edit-button"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Link>
                                </td>
                                <td className="button-cell">
                                    <Link
                                        to={`/delete-transaction/${transaction._id}`}
                                        className="delete-button table-button"
                                        id="delete-button"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </Link>
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
        </section >

    );
}

export default Transactions;
