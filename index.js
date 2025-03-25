require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const serverless = require('serverless-http');
const cors = require('cors');
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRouter");
const queriesRouter = require("./routes/queriesRouter");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

connectDB();


app.use(express.json());

app.use(userRouter);
app.use(companyRouter);
app.use(queriesRouter);


app.get("/", async (req, res) => {
    res.send("API is running on AWS...");
});

module.exports.handler = serverless(app);