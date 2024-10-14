import { Link, useNavigate } from "react-router-dom";
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
    formattedDate?: string;
}

function Transactions() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                axios.defaults.withCredentials = true;
                console.log('Fetching user ID...');
                const response = await axios.get('http://localhost:3000/auth/current-user');
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
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:3000/transaction/transactions?userId=${userId}`, {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    });

                    // Format the date for each transaction
                    const formattedTransactions = response.data.map((transaction: Transaction) => {
                        return {
                            ...transaction,
                            formattedDate: new Date(transaction.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                timeZone: 'UTC'
                            }),
                        };
                    });

                    setTransactions(formattedTransactions);
                } catch (error) {
                    console.error('Failed to fetch transactions:', error);
                }
            }
        };
        fetchTransactions();
    }, [userId]);


    const handleDelete = async (transactionId: string) => {
         //popup message to confirm deletion
         const confirmed = window.confirm('Are you sure you want to delete this transaction?');
         if(confirmed){
            try{
                await axios.delete(`http://localhost:3000/transaction/delete-transaction/${transactionId}`); 
                setTransactions(transactions.filter(transaction => transaction._id !== transactionId)); // Remove the deleted transaction from state
            } catch(error){
                console.error('Failed to delete transaction:', error);
            }
         }
    };

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
                        {transactions.map(transaction => (
                            <tr key={transaction._id}>
                                <td>{transaction.name}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.amount.toFixed(2)}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.formattedDate}</td>
                                <td className="button-cell">
                                    <button
                                        onClick={() => navigate(`/edit-transaction/${transaction._id}`, { state: { transaction } })}
                                        className="edit-button table-button"
                                        id="edit-button"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                </td>
                                <td className="button-cell">
                                    <button
                                        onClick={() => handleDelete(transaction._id)}
                                        className="delete-button table-button"
                                        id="delete-button"
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
        </section >

    );
}

export default Transactions;
