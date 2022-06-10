const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

require("dotenv").config();
const db = require("./db");

const passport = require("passport");
const LocalStrategy = require("./config/passport/local-strategy");
const JWTStrategy = require("./config/passport/jwt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
passport.use(JWTStrategy);
app.use(passport.initialize());

const chatroomRoute = require("./routes/chatroom_route");
app.use(
  "/chatroom",
  passport.authenticate("jwt", { session: false }),
  chatroomRoute
);

const authRoute = require("./routes/auth_route");
app.use("/auth", authRoute);

app.get('/api', (req, res) => {
  res.send(200).json({message: "API Working"})
})

const PORT = process.env.PORT || "4000";

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});