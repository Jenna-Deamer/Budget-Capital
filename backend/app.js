const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const authRouter = require("./routes/auth");
const transactionRouter = require("./routes/transaction");
const budgetRouter = require("./routes/budget");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var session = require("express-session");
const User = require("./models/user");

// Use dotenv in non-production environments
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// CORS configuration
const allowedOrigins = [
    "http://localhost:5173",
    "https://budget-capital-backend.onrender.com" 
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: "GET,POST,PUT,DELETE,HEAD,OPTIONS",
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS
            httpOnly: true, // Mitigates the risk of client-side script accessing the cookie
            sameSite: 'lax', // Allow cross-origin cookie usage
            maxAge: 3600000, // 1 hour
        },
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Local Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use JSON middleware and URL-encoded parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
