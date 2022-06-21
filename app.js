const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const cookieparser = require('cookie-parser');
const expressSanitizer = require('express-sanitizer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const server = http.createServer(app);

require("dotenv").config();
const db = require("./db");

const passport = require("passport");
const LocalStrategy = require("./config/passport/local-strategy");
const JWTStrategy = require("./config/passport/jwt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieparser());
app.use(expressSanitizer());
app.use(helmet());


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`A user connected`);

  let room = "";
  socket.on("room identifier", (roomId) => {
    room = roomId;
    socket.join(room);
  });

  socket.on("roommessage", (message, user, chatInfo) => {
    io.to(room).emit("roommessage", `${message}`);
    const notificationObject = {
      message: message,
      user: user,
      chatInfo: chatInfo,
    };
    io.emit("notification", notificationObject);
  });

  socket.on("notificationlink", (message) => {
    console.log("Notifications Link Established");
  });

  socket.on("typing", (displayname, id) => {
    io.to(room).emit("typing", `${id}`);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

passport.use(LocalStrategy);
passport.use("jwt", JWTStrategy);
app.use(passport.initialize());

const chatroomRoute = require("./routes/chatroom_route");
app.use(
  "/chatroom",
  passport.authenticate("jwt", { session: false }),
  chatroomRoute
);

const authRoute = require("./routes/auth_route");
app.use("/auth", authRoute);

app.get('*', (req, res) => {
  res.status(404).json("Not Found");
});

const PORT = process.env.PORT || "5000";

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});