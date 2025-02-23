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
        console.log("User ID from token:", req.user.userId); // Debug user ID
        const categories = await Category.find({ user: req.user.userId });
        console.log("Found categories:", categories); // Debug categories

        if (!categories || categories.length === 0) {
            // If no categories found, create defaults
            const defaultCategories = {
                income: [
                    { name: "Salary", type: "Income", color: "#4CAF50" },
                    { name: "Investments", type: "Income", color: "#2196F3" },
                    { name: "Bonus", type: "Income", color: "#9C27B0" },
                    { name: "Other", type: "Income", color: "#607D8B" },
                ],
                expense: [
                    { name: "Housing", type: "Expense", color: "#F44336" },
                    { name: "Food", type: "Expense", color: "#E91E63" },
                    {
                        name: "Transportation",
                        type: "Expense",
                        color: "#673AB7",
                    },
                    { name: "Other", type: "Expense", color: "#607D8B" },
                ],
            };

            const categoriesToCreate = [
                ...defaultCategories.income.map((cat) => ({
                    ...cat,
                    user: req.user.userId,
                    isDefault: true,
                })),
                ...defaultCategories.expense.map((cat) => ({
                    ...cat,
                    user: req.user.userId,
                    isDefault: true,
                })),
            ];

            const createdCategories = await Category.insertMany(
                categoriesToCreate
            );
            return res.json(createdCategories);
        }

        res.json(categories);
    } catch (err) {
        console.error("Error in /categories route:", err);
        res.status(500).json({ message: err.message });
    }
});

// Create new custom category

// Delete category (both custom & default)

// Update category (both custom & default)

// Create default categories for new user during signup
router.post("/create-default-categories", isAuthenticated, async (req, res) => {
    try {
        // Map the default categories to inlucde User ID & isDefault flag
        const incomeCategories = defaultCategories.income.map((category) => ({
            ...category,
            type: "Income",
            user: req.user.userId,
            isDefault: true,
        }));

        const expenseCategories = defaultCategories.expense.map((category) => ({
            ...category,
            type: "Expense",
            user: req.user.userId,
            isDefault: true,
        }));
        // Insert all default categories into single array
        await Category.insertMany([...incomeCategories, ...expenseCategories]);

        // Send success response
        res.status(201).json({ message: "Default categories created" });
    } catch (err) {
        // If error send failure response
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
