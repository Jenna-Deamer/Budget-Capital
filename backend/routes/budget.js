const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");
const Budget = require("../models/budget");

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User is authenticated:", req.user);
        return next(); // Proceed to the next middleware or route handler
    }
    console.log("User is not authenticated");
    return res.status(401).json({ message: "Not authorized" });
}

// Get budget for selected MM/YYYY
router.get("/budget", isAuthenticated, async (req, res) => {
    try {
        // Get month and year from query parameters
        const month = req.query.month;
        const year = parseInt(req.query.year);

        // Find budget for the specified month/year and user
        const budget = await Budget.findOne({
            user: req.user._id,
            month: month,
            year: year
        });

        if (!budget) {
            return res.status(404).json({
                message: "No budget found for this month/year"
            });
        }

        // If found, return the budget
        return res.status(200).json(budget);

    } catch (err) {
        console.error("Error fetching budget:", err);
        return res.status(500).json({
            message: "Error retrieving budget"
        });
    }
});

// POST: Create a new budget
router.post("/create-budget", isAuthenticated, async (req, res) => {
    console.log("Budget route called");
    try {
        const { amount, month, year } = req.body;

        // Check if budget already exists for this month/year
        const existingBudget = await Budget.findOne({
            user: req.user._id,
            month: month,
            year: year
        });

        if (existingBudget) {
            return res.status(400).json({
                message: "Budget already exists for this month"
            });
        }

        // Create new budget
        const budget = await Budget.create({
            user: req.user._id,
            month: month,
            year: year,
            targetAmount: amount,
            actualAmount: 0 // Start with 0, will be updated as transactions are added
        });

        res.status(201).json(budget);
    } catch (err) {
        console.error("Error creating budget:", err);
        res.status(500).json({ message: "Error creating budget" });
    }
});

module.exports = router;
