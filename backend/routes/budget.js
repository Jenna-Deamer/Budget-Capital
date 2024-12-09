const express = require("express");
const router = express.Router();
const Budget = require("../models/budget");
const { verifyToken } = require("../utils/jwt");
// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    console.log("Auth Header:", req.headers.authorization); // Debug: Check auth header
    const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
        console.log("No token found in header");
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = verifyToken(token); // Decode the token
        console.log("Decoded token:", decoded); // Log decoded token to verify its contents
        console.log("User ID from token:", decoded._id); // Debug: Check if _id exists
        req.user = decoded; // Attach decoded token data to the request object
        next();
    } catch (err) {
        console.error("Token decoding failed:", err); // Log any error in decoding
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}


// Get budget for selected MM/YYYY
router.get("/budget", isAuthenticated, async (req, res) => {
    try {
        // Get month and year from query parameters
        const month = req.query.month;
        const year = parseInt(req.query.year);

        // Find budget for the specified month/year and user
        const budget = await Budget.findOne({
            user: req.user.userId,
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
    try {
        const { amount, month, year } = req.body;

        // Check if a budget already exists for this month/year
        const existingBudget = await Budget.findOne({
            user: req.user.userId,
            month: month,
            year: year
        });

        if (existingBudget) {
            return res.status(400).json({
                success: false,
                message: "A budget already exists for this month and year"
            });
        }

        const budget = new Budget({
            amount,
            month,
            year,
            user: req.user.userId
        });

        await budget.save();
        res.status(201).json({ success: true, budget });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating budget: " + error.message
        });
    }
});



/* PUT: /api/budget/edit-budget => update selected budget */
router.put("/edit-budget", isAuthenticated, async (req, res, next) => {
    console.log("Got request to edit budget with data:", req.body);

    const { id, amount, ...updatedData } = req.body;

    // Validate required fields
    if (!id || !amount) {
        return res.status(400).json({ error: "ID and amount are required" });
    }

    // Ensure amount is a number
    updatedData.amount = parseFloat(amount);

    try {
        const budget = await Budget.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true
        });

        if (!budget) {
            return res.status(404).json({ error: "Budget not found" });
        }

        console.log("Updated Budget:", budget);
        // Send the updated budget as the response
        return res.status(200).json(budget);
    } catch (err) {
        console.error("Error updating budget:", err);
        return res.status(500).json({ error: err.message });
    }
});

// DELETE: /delete-budget => delete selected budget
router.delete("/delete-budget", isAuthenticated, async (req, res) => {
    try {
        const month = req.query.month;
        const year = parseInt(req.query.year);

        console.log('Delete budget request:', {
            userId: req.user.userId,
            month,
            year
        });

        const budget = await Budget.findOneAndDelete({
            user: req.user.userId,
            month: month,
            year: year
        });

        if (!budget) {
            console.log('No budget found with criteria:', {
                user: req.user.userId,
                month,
                year
            });
            return res.status(404).json({ error: "Budget not found" });
        }

        console.log('Successfully deleted budget:', budget);
        return res.status(200).json({ message: "Budget deleted successfully" });
    } catch (err) {
        console.error("Error deleting budget:", err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;