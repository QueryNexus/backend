require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRouter");
const queriesRouter = require("./routes/queriesRouter");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

connectDB();


app.use(express.json());

app.use(userRouter);
app.use(companyRouter);
app.use(queriesRouter);





app.get("/", async (req, res) => {
    res.send("API is running...");
});


app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
