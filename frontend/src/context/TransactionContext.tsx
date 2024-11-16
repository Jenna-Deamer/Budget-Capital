import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { Transaction } from "../types/Transaction";

interface TransactionContextType {
  transactions: Transaction[]; 
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>; 
  selectedDate: Date; 
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>; 
}

// Create context with initial value as null
const TransactionContext = createContext<TransactionContextType | null>(null);

// Define the type for the props of the TransactionProvider component
interface TransactionProviderProps {
  children: ReactNode; // children prop for wrapping components with this context
}

// TransactionProvider component provides the transaction context to its children
export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<string | null>(null);

// Get the current user's data  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        axios.defaults.withCredentials = true; 
        const response = await axios.get("http://localhost:3000/auth/current-user"); 
        if (response.data) {
          setUserId(response.data.userId); // Set the user ID in state
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
          // Get the selected month and year from the selected date
          const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-based, so add 1
          const selectedYear = selectedDate.getFullYear();

          // fetch the user's transactions for their selected month and year
          const response = await axios.get(
            `http://localhost:3000/transaction/transactions?userId=${userId}&month=${selectedMonth}&year=${selectedYear}`,
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
          );

           // format the date into a human-readable string
          const formattedTransactions = response.data.map((transaction: Transaction) => ({
            ...transaction, // spread the original transaction data
            formattedDate: new Date(transaction.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }), 
          }));

          // Update the transactions state with the formatted transactions
          setTransactions(formattedTransactions);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        }
      }
    };
    fetchTransactions();
  }, [userId, selectedDate]); 
  // Return the context provider wrapping the children components with the transaction context values
  return (
    <TransactionContext.Provider value={{ transactions, setTransactions, selectedDate, setSelectedDate }}>
      {children} {/* Render the child components inside the provider */}
    </TransactionContext.Provider>
  );
};


export default TransactionContext;
