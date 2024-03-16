const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/config.env" });

const { connectDB } = require("./config/db");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const companyRoutes = require("./routes/company");

app.use("/api/v1/company", companyRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
