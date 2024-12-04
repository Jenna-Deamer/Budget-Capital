import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TransactionContext from "../../context/TransactionContext";
import "../../styles/forms/TransactionEdit.css";
import axios from "axios";

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

const EditTransaction = () => {
  const location = useLocation();
  const { transaction } = location.state;
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const { setTransactions } = useContext(TransactionContext)!;
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    type: "",
    category: "",
    date: "",
    id: "",
  });

  // Fetch current transaction data
  useEffect(() => {
    if (transaction) {
      console.log(transaction);
      // Format the date to display in the input field
      const formattedDate = new Date(transaction.date)
        .toISOString()
        .split("T")[0]; // Convert to YYYY-MM-DD format
      setFormData({
        name: transaction.name,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: formattedDate, // Set the formatted date
        id: transaction._id,
      });
    }
  }, [transaction]);

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:3000/transaction/edit-transaction",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Success:", response.data);

    // if _id is returned, it means the transaction was created successfully
    if (response.data._id) {
      const updatedTransaction = {
        ...response.data,
        formattedDate: new Date(response.data.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      // Update the transactions in context 
      setTransactions(prevTransactions => [
        // Filter  and keep all transactions except the one that was updated
        ...prevTransactions.filter(transaction => transaction._id !== response.data._id),
        updatedTransaction
      ]);
      navigate("/transactions");
    } else {
      console.log("Edit Failed: ", response.data.message);
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
    <>
      <section className="crud-page-wrapper">
        <article className="crud-form-container">
          <h1 className="text-center pb-2">Edit Transaction</h1>
          <form className="crud-form" onSubmit={handleEdit}>
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
                Update
              </button>
            </div>
          </form>
        </article>
      </section>
    </>
  );
};

export default EditTransaction;
