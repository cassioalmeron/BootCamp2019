const express = require("express");

const server = express();
server.use(express.json());

const users = ["Diego", "Claudio", "Victor"];

// middleware global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

// middleware Local
function checkUserExists(req, res, next) {
  if (!req.body.name)
    return res.status(400).json({ error: "User name is Required" });

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) return res.status(400).json({ error: "User does not exists" });

  req.user = user;

  return next();
}

// localhost:3000/users/1
server.get("/users", (req, res) => {
  return res.json(users);
});

// localhost:3000/users/1
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(users[req.params.index]);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { name } = req.body;
  users[req.params.index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  users.splice(req.params.index, 1);

  return res.send();
});

server.listen(3000);
