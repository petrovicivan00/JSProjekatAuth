const express = require("express");
require("dotenv").config();
const cors = require('cors');
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/auth", authRoute);

mongoose.connect('mongodb://localhost:27017/MyMovies')
        .then(() => console.log("DB Connection Successfull"))
        .catch(err => console.log(err));

app.listen( process.env.PORT | 2000, () => {
    console.log("Backend server is running on port " + process.env.PORT);
});