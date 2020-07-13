const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user.route");
const todoRoutes = require("./routes/todo.route");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });

mongoose.set("debug", true);
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

app.use("/todos", todoRoutes);
app.use("/users", userRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
