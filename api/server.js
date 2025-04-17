const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const todoRoutes = require("./routes/todoRoutes")

dotenv.config();

connectDB();

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'https://md-dev-007.github.io',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json("hello world");
});

app.use("/api/todos", todoRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Something went wrong"});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
})