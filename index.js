require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRouter");
const queriesRouter = require("./routes/queriesRouter");

const app = express();

app.use(cors());

connectDB();
app.use(express.json());

app.use(userRouter);
app.use(companyRouter);
app.use(queriesRouter);

app.get("/", async (_, res) => {
  res.send("API is running...");
});

module.exports = app;
