const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config({ path: "./config/config.env" });

const { connectDB } = require("./config/db");
connectDB();

const passport = require("./middleware/passport");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", authRoutes);
const companyRoutes = require("./routes/company");

app.use("/api/v1/company", companyRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the home page");
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});