const app = require('./app')
const http = require("http");
const server = http.createServer(app);


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

const PORT = process.env.PORT || "5000";

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
