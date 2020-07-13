const express = require("express");

const verifyJWT = require("../middleware/verifyJWT");
const TodoModel = require("../models/todo.model");

const todoRoutes = express.Router();

todoRoutes.use(verifyJWT);

todoRoutes.route("/").get(function(req, res) {
  TodoModel.find({ todo_userId: req.userId }, function(err, todos) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
    res.json(todos);
  });
});

todoRoutes.route("/").post(function(req, res) {
  const todo = new TodoModel({
    ...req.body,
    todo_userId: req.userId
  });

  todo
    .save()
    .then(todo => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/:id").get(function(req, res) {
  TodoModel.findOne({ _id: req.params.id, todo_userId: req.userId }, function(
    err,
    todo
  ) {
    if (err || !todo) {
      return res.status(400).json({
        message: "Todo doesn't exist"
      });
    }

    res.json(todo);
  });
});

todoRoutes.route("/:id").put(function(req, res) {
  TodoModel.findOne({ _id: req.params.id, todo_userId: req.userId }, function(
    err,
    todo
  ) {
    if (err || !todo) {
      return res.status(404).send("data is not found");
    }

    todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_completed = req.body.todo_completed;

    todo
      .save()
      .then(todo => {
        res.json({ message: "Todo updated!" });
      })
      .catch(err => {
        res.status(400).json({ message: "Update not possible" });
      });
  });
});

module.exports = todoRoutes;
