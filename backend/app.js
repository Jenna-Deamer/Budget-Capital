const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const authRouter = require("./routes/auth");
const transactionRouter = require("./routes/transaction");
const budgetRouter = require("./routes/budget");
const User = require("./models/user");

// Use dotenv in non-production environments
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// CORS configuration
const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"];

app.use(
    cors({
        origin: allowedOrigins,
        methods: "GET,POST,PUT,DELETE,HEAD,OPTIONS",
        credentials: true,
    })
);

// Use JSON middleware and URL-encoded parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const uri = process.env.CONNECTION_STRING;
const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
};

// MongoDB connection
async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("mongodb connection successful");
    } catch (e) {
        console.error(e);
    }
}
run().catch(console.dir);

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
