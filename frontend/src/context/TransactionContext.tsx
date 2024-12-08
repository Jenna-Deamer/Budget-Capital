import React, { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import axios from "axios";
import { Transaction } from "../types/Transaction";

interface TransactionContextType {
    transactions: Transaction[];
    totalIncome: number;
    totalExpense: number;
    incomeCategories: { [key: string]: number };
    expenseCategories: { [key: string]: number };
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

// Create context with initial value as null
const TransactionContext = createContext<TransactionContextType | null>(null);

interface TransactionProviderProps {
    children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch user ID on component mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    throw new Error("No token found in localStorage");
                }
                const response = await axios.get("http://localhost:3000/auth/check-auth",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.data) {
                    setUserId(response.data.user.id)
                }
            } catch (error) {
                console.error("Failed to fetch user ID:", error);
            }
        };
        fetchUserId();
    }, []);


    // Fetch transactions when user ID or selected date changes
    useEffect(() => {
        const fetchTransactions = async () => {
            if (userId) {
                try {
                    const token = localStorage.getItem('jwtToken');
                    if (!token) {
                        throw new Error("No token found");
                    }

                    const selectedMonth = selectedDate.getMonth() + 1;
                    const selectedYear = selectedDate.getFullYear();

                    const response = await axios.get(
                        `http://localhost:3000/transaction/transactions?userId=${userId}&month=${selectedMonth}&year=${selectedYear}`,
                        { 
                            headers: { 
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    );

                    const formattedTransactions = response.data.map((transaction: Transaction) => ({
                        ...transaction,
                        formattedDate: new Date(transaction.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }),
                    }));

                    setTransactions(formattedTransactions);
                } catch (error) {
                    console.error("Failed to fetch transactions:", error);
                }
            }
        };
        fetchTransactions();
    }, [userId, selectedDate]);

    // Calculate total income, total expense, and each category total when transactions change
    const { totalIncome, totalExpense, incomeCategories, expenseCategories } = useMemo(() => {
        let totalIncome = 0;
        let totalExpense = 0;
        // Initialize objects to store category totals for income and expense
        const incomeCategories: { [key: string]: number } = {};
        const expenseCategories: { [key: string]: number } = {};

        // Iterate through each transaction to calculate totals and category breakdowns
        transactions.forEach(transaction => {
            const { amount, type, category } = transaction; // Destructure the amount, type, and category from the transaction

            if (type.toLowerCase() === "income") {
                totalIncome += amount; // Add the transaction amount to total income
                // Add the amount to the corresponding income category, or initialize it if not present
                incomeCategories[category] = (incomeCategories[category] || 0) + amount;
            } else if (type.toLowerCase() === "expense") {
                totalExpense += amount; // Add the transaction amount to total expense
                // Add the amount to the corresponding expense category, or initialize it if not present
                expenseCategories[category] = (expenseCategories[category] || 0) + amount;
            }
        });

        return { totalIncome, totalExpense, incomeCategories, expenseCategories };
    }, [transactions]);

    // Providing the calculated totals and categories to the context consumers
    return (
        <TransactionContext.Provider
            value={{
                transactions,
                totalIncome,
                totalExpense,
                incomeCategories,
                expenseCategories,
                setTransactions,
                selectedDate,
                setSelectedDate,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};

export default TransactionContext;
