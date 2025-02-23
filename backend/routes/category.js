const express = require("express");
const router = express.Router();
const Category = require("../models/customCategory");
const { verifyToken } = require("../utils/jwt");

const defaultCategories = {
    income: [
        { name: "Salary", color: "#4CAF50" },
        { name: "Investments", color: "#2196F3" },
        { name: "Bonus", color: "#9C27B0" },
        { name: "Freelancing", color: "#FF9800" },
        { name: "Gifts", color: "#795548" },
        { name: "Other", color: "#607D8B" },
    ],
    expense: [
        { name: "Housing", color: "#F44336" },
        { name: "Food", color: "#E91E63" },
        { name: "Healthcare", color: "#9C27B0" },
        { name: "Transportation", color: "#673AB7" },
        { name: "Entertainment", color: "#3F51B5" },
        { name: "Education", color: "#2196F3" },
        { name: "Debt Payments", color: "#009688" },
        { name: "Personal Care", color: "#4CAF50" },
        { name: "Taxes", color: "#FF5722" },
        { name: "Other", color: "#607D8B" },
    ],
};

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

// GET all categories (custom & defaults)
router.get("/categories", isAuthenticated, async (req, res) => {
    try {
        let categories = await Category.find({ user: req.user.userId });

        // Create defaults only if user has no categories
        if (!categories || categories.length === 0) {
            const categoriesToCreate = [
                ...defaultCategories.income.map((cat) => ({
                    ...cat,
                    type: "Income",
                    user: req.user.userId,
                    isDefault: true,
                })),
                ...defaultCategories.expense.map((cat) => ({
                    ...cat,
                    type: "Expense",
                    user: req.user.userId,
                    isDefault: true,
                })),
            ];

            categories = await Category.insertMany(categoriesToCreate);
        }

        res.json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ message: err.message });
    }
});
// Create new custom category

// Delete category (both custom & default)

// Update category (both custom & default)

module.exports = router;
