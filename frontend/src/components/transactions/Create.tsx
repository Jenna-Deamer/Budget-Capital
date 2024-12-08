import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TransactionContext from "../../context/TransactionContext";
import "../../styles/forms/TransactionCreate.css";

const incomeCategories = [
  "Salary",
  "Investments",
  "Bonus",
  "Freelancing",
  "Gifts",
  "Other",
];
const expenseCategories = [
  "Housing",
  "Food",
  "Healthcare",
  "Transportation",
  "Entertainment",
  "Education",
  "Debt Payments",
  "Personal Care",
  "Taxes",
  "Other",
];

const CreateTransaction = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const { setTransactions } = useContext(TransactionContext)!;
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    type: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    if (formData.type === "Income") {
      setCategories(incomeCategories);
    } else if (formData.type === "Expense") {
      setCategories(expenseCategories);
    } else {
      setCategories([]);
    }
  }, [formData.type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "http://localhost:3000/transaction/create-transaction",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true,
        }
      );
  
      console.log("Success:", response.data);
  
      // if _id is returned, it means the transaction was created successfully
      if (response.data._id) {
        // Add formattedDate to the new transaction
        const newTransaction = {
          ...response.data,
          formattedDate: new Date(response.data.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        };
        // update transactions in context
        setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
        navigate("/transactions");
      } else {
        console.log("Creation Failed: ", response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };
  

  return (
    <section className="crud-page-wrapper">
      <article className="crud-form-container">
        <h1 className="text-center pb-2">Create Transaction</h1>

        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              className="form-control"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              className="form-control"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-button-wrapper">
            <button type="submit" className="button primary-button">
              Create
            </button>
          </div>
        </form>
      </article>
    </section>
  );
};

export default CreateTransaction;
