require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");

const Rollbar = require("rollbar");

// const { SERVER_PORT, ROLLBAR_TOKEN } = process.env;

const rollbar = new Rollbar({
  accessToken: '3d34c50745ea41a9a06c12e1769dcb2b',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

app.use(express.json());

// students
const students = ["alan", "sydney", "lex"];

// endpoints
app.get("/", (req, res) => {
  rollbar.info("someone visited our site!");

  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

app.post("/api/students", (req, res) => {
  const { name } = req.body;

  if (!name) {
    rollbar.error("someone tried to add an empty name!");

    return res.status(403).send("you must provide a name");
  }

  const index = students.findIndex((studentName) => name === studentName);

  if (index === -1) {
    rollbar.info("someone added a student");

    students.push(name);

    res.status(200).send(students);
  } else {
    rollbar.error("someone tried to add an existing student!");

    res.status(403).send("student already exists!");
  }
});

rollbar.log("server started!");

const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`server running on ${port}`));
