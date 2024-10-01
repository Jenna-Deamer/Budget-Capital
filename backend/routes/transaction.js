const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('User is authenticated:', req.user); 
        return next(); // Proceed to the next middleware or route handler
    }
    console.log('User is not authenticated');
    return res.status(401).json({ message: "Not authorized" }); 
}

/** GET: /transactions => show all transactions */
router.get("/transactions", async (req, res) => {
    const userId = req.query.userId; // Get userId from query parameters
    try {
        let transactions = await Transaction.find({userId}).sort({ date: -1 });
        return res.status(200).json(transactions); // Set status before sending response
    } catch (err) {
        console.error("Error fetching transactions:", err);
        return res.status(400).json({ error: "Error fetching transactions" }); 
    }
});

/** POST: /transactions/create => create new transaction from request body */
router.post('/create-transaction', isAuthenticated, async (req, res) => {
    console.log("Received request to create transaction:", req.body)
    try {
        // Create the transaction and associate it with the logged-in user
        const transaction = await Transaction.create({
            ...req.body,
            user: req.user._id // Ensure the transaction is associated with the authenticated user
        });
        console.log("Transaction created:", transaction); 
        return res.status(201).json(transaction); // Respond with the created transaction
    } catch (err) {
        console.error("Error creating transaction:", err); 
        return res.status(400).json({ error: "Error creating transaction" }); 
    }
});

module.exports = router;
