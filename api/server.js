const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const todoRoutes = require("./routes/todoRoutes")

dotenv.config();

connectDB();

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configure CORS with specific options
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: false,
    maxAge: 600,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

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