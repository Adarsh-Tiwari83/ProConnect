const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/config.env" });
const userRoutes = require("./routes/userRoute");
const postRoutes = require("./routes/postRoute");

const { connectDB } = require("./config/db");
connectDB();

<<<<<<< Updated upstream
=======
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  socket.on("message", (msg) => {
    console.log("Message Received: ", msg);
    io.emit("message", msg);
  });
});

const passport = require("./middleware/passport");
const authRoutes = require("./routes/authRoutes");

>>>>>>> Stashed changes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

<<<<<<< Updated upstream
=======
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", authRoutes);
>>>>>>> Stashed changes
const companyRoutes = require("./routes/company");

app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/post", postRoutes);

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
