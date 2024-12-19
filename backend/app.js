const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const authRouter = require("./routes/auth");
const transactionRouter = require("./routes/transaction");
const budgetRouter = require("./routes/budget");

// Use dotenv in non-production environments
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

app.use(
    cors({
        origin: [
            "http://localhost:5173",  // Local frontend dev
            "http://localhost:4173",  // Local frontend preview
            "https://budget-capital-frontend.onrender.com", // Production frontend
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Access-Control-Allow-Origin"],
        optionsSuccessStatus: 200
    })
);

// Add security headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Use JSON middleware and URL-encoded parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection Setup
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }

        await mongoose.connect(mongoURI, {
            // Modern connection options
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            maxPoolSize: 10, // Maintain up to 10 socket connections
            family: 4 // Use IPv4, skip trying IPv6
        });

        console.log(`MongoDB connected: ${isProduction ? 'Production' : 'Development'} mode`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Attempt to reconnect
        setTimeout(connectDB, 5000);
    }
};

// Initialize database connection
connectDB();

// Define routers
app.use("/auth", authRouter);
app.use("/transaction", transactionRouter);
app.use("/budget", budgetRouter);


app.use("/protected", (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        // Verify the token
        const decoded = require("./utils/jwt").verifyToken(token);
        req.user = decoded; // Attach decoded user to the request object
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
});

// Test protected route
app.get("/protected", (req, res) => {
    res.json({ message: "This is protected data", user: req.user });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
