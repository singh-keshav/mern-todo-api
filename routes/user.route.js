const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");

const userRoutes = express.Router();
const config = require("../config");
const UserModel = require("../models/user.model");

userRoutes.post("/register", (req, res) => {
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  };

  UserModel.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          UserModel.create(userData).then(user => {
            res.json({ status: user.email + " registered" });
          });
        });
      } else {
        res.json({ error: "usr already registered" });
      }
    })
    .catch(err => {
      res.send("error") + err;
    });
});

userRoutes.post("/login", (req, res) => {
  UserModel.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          };

          const token = jwt.sign(payload, config.jwtSecret, {
            expiresIn: 24 * 60 * 60 * 1000
          });

          res.json({
            token,
            ...payload
          });
        } else {
          res.json({ error: "user does not exist" });
        }
      } else {
        res.json({ error: "user does not exist" });
      }
    })
    .catch(err => {
      res.send("error" + err);
    });
});

module.exports = userRoutes;
