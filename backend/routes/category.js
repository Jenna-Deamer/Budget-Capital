const express = require("express");
const router = express.Router();
const Category = require("../models/customCategory");
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

// GET all categories (custom & defaults)
router.get("/categories", isAuthenticated, async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.userId });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Create new custom category

// Delete custom category

// Update custom category

// Edit default category (Rename, Change color)

module.exports = router;
