const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { performCalculations } = require("./controller");

const app = express(); // Initialize express
const port = 3000; // Set port for server to l

app.use(bodyParser.json()); // Use bodyparser middleware to enable json request
app.use(cors()); // Use cors to enable access from frontend origin

// Middleware to log requests
app.use((req, res, next) => {
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

    console.log(`${req.method}:  ${fullUrl}`);
    next();
});

// Heath check endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        status: true,
        message: "Server running smoothly",
    });
});

// Endpoint to run calculations
app.post("/calculate", (req, res) => {
    const results = performCalculations(
        req.body.timeValues,
        req.body.inflowValues,
        req.body.outflowValues,
        req.body.weightFactor,
        req.body.timeFactor
    );
    res.status(200).json({
        status: true,
        results,
    });
});

// Endpoint to handle 404 errors
app.all("*", (req, res) => {
    res.status(404).json({
        status: false,
        message: "Page not found",
    });
});

// Startup server
app.listen(port, () =>
    console.log(`Muskingum server listening on port ${port}!`)
);
