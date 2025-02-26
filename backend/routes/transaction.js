const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");
const { verifyToken } = require("../utils/jwt");

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

/** GET: /transactions => show all transactions */
router.get("/transactions", isAuthenticated, async (req, res) => {
    // Get data from query parameters
    const userId = req.query.userId;
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    try {
        // define the start and end of the selected month for filtering
        const startOfMonth = new Date(year, month - 1, 1); // Month is zero-indexed, so subtract 1
        const endOfMonth = new Date(year, month, 0); // The 0th day gives the last day of the previous month

        // find transactions for the selected month and year
        let transactions = await Transaction.find({
            user: userId,
            /**
             * MongoDB query:
             * - $gte (greater than or equal to): Get transactions from the start of the selected month.
             * - $lte (less than or equal to): Get transactions up until the end of the selected month.
             */
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        })
            .populate("category", "name type color") // replaces the category id with the actual category data
            .sort({ date: -1 });

        // Map transactions to include category name instead of ID
        transactions = transactions.map((transaction) => {
            if (transaction.category && transaction.category.name) {
                return {
                    ...transaction.toObject(),
                    category: transaction.category.name, // Use category name instead of ID
                };
            } else {
                console.error("Category not found for transaction:", transaction);
                return {
                    ...transaction.toObject(),
                    category: "Unknown", // Fallback category name
                };
            }
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
            user: req.user.userId,
        });

        // Populate the category details before sending response
        const populatedTransaction = await Transaction.findById(
            transaction._id
        ).populate("category", "name type color");

        // Convert category to name for frontend consistency
        const responseTransaction = {
            ...populatedTransaction.toObject(),
            category: populatedTransaction.category.name,
        };

        return res.status(201).json(responseTransaction);
    } catch (err) {
        console.error("Error creating transaction:", err);
        return res.status(400).json({ error: "Error creating transaction" });
    }
});

/*PUT: /api/transactions/abc123 => update selected transaction */
router.put("/edit-transaction", isAuthenticated, async (req, res, next) => {
    const { id, ...updatedData } = req.body;
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            id,
            updatedData,
            {
                new: true,
            }
        ).populate("category", "name type color");

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const responseTransaction = {
            ...transaction.toObject(),
            category: transaction.category.name,
        };

        return res.json(responseTransaction);
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
