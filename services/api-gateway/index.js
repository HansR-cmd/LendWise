const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./config/db");
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
connectDB();


// CORRECT IMPORT
const userRoutes = require("./routes/userRoutes");

// CORRECT ROUTE MOUNT
app.use("/users", userRoutes);

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});

const loanRoutes = require("./routes/loanRoutes");
app.use("/loans", loanRoutes);

const recommendationRoutes = require("./routes/recommendationRoutes");
app.use("/recommendations", recommendationRoutes);