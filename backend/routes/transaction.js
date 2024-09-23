const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");

/**GET: /api/transactions => show all transactions */
router.get("/", async (req, res) => {
    try {
        let transactions = await Transaction.find().sort({ date: -1 });
        return res.status(200).json(transactions); // Set status before sending response
    } catch (err) {
        console.error("Error fetching transactions:", err);
        return res.status(400).json({ error: "Error fetching transactions" }); // Respond with an error message
    }
});

/**POST: /api/transactions/create => create new transaction from request body */
router.post('/create-transaction', async (req, res) => {
    console.log("Received request to create transaction:", req.body)
    try {
        const transaction = await Transaction.create(req.body);
        console.log("Transaction created:", transaction); // Log the created transaction
        return res.status(201).json(transaction); // Set status before sending response
    } catch (err) {
        console.error("Error creating transaction:", err); // Log any errors that occur
        return res.status(400).json({ error: "Error creating transaction" }); // Send a custom error message
    }
});

module.exports = router;
