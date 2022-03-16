//Import packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (_, res) => {
  res.send("C2S");
});

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => console.log("Server started"));
mongoose.connect(process.env.DB_CONNECTION, () => console.log("connected"));

