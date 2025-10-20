require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, logger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

const { login, createUser } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems");

app.use(cors());
// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Global middleware
app.use(express.json());
app.use(requestLogger);

// Sign up new users / Sign in existing users
app.post("/signup", createUser);
app.post("/signin", login);
app.get("/items", getItems);

// Protected Routes
app.use(auth);
app.use("/", mainRouter);

// celebrate error handler
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
