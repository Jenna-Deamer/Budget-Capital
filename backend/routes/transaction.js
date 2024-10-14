const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User is authenticated:", req.user);
        return next(); // Proceed to the next middleware or route handler
    }
    console.log("User is not authenticated");
    return res.status(401).json({ message: "Not authorized" });
}

/** GET: /transactions => show all transactions */
router.get("/transactions", isAuthenticated, async (req, res) => {
    const userId = req.query.userId; // Get userId from query parameters
    try {
        let transactions = await Transaction.find({ user: userId }).sort({
            date: -1,
        });
        return res.status(200).json(transactions); // Set status before sending response
    } catch (err) {
        console.error("Error fetching transactions:", err);
        return res.status(400).json({ error: "Error fetching transactions" });
    }
});

/** POST: /transactions/create => create new transaction from request body */
router.post("/create-transaction", isAuthenticated, async (req, res) => {
    try {
        // Create the transaction and associate it with the logged-in user
        const transaction = await Transaction.create({
            ...req.body,
            user: req.user._id, // Ensure the transaction is associated with the authenticated user
        });
        return res.status(201).json(transaction); // Respond with the created transaction
    } catch (err) {
        console.error("Error creating transaction:", err);
        return res.status(400).json({ error: "Error creating transaction" });
    }
});

/*PUT: /api/transactions/abc123 => update selected transaction */
router.put("/edit-transaction", isAuthenticated, async (req, res, next) => {
    console.log("Got request to edit transaction");
    const { id, ...updatedData } = req.body;
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        return res.json(transaction).status(200);
    } catch (err) {
        console.error("Error updating transaction:", err);
        return res.status(500).json({ error: err.message });
    }
});

/* DELETE: /api/transaction/abc123 => delete selected transaction */
router.delete("/delete-transaction/:id", isAuthenticated, async (req, res) => {
    const transactionId = req.params.id;
    try {
        await Transaction.findByIdAndDelete(transactionId);
        return res.json({}).status(204); // 204: No Content
    } catch (err) {
        return res.json(err).status(404); //not Found
    }
});

module.exports = router;
