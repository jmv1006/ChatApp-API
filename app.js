const express = require("express");
const app = express();
const cors = require('cors');
const http = require("http")
const server = http.createServer(app);

require('dotenv').config();
const db = require('./db');

const passport = require('passport');
const LocalStrategy = require('./config/passport/local-strategy');
const JWTStrategy = require('./config/passport/jwt')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const io = require('socket.io')(server,{
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("message", (message) => {
        console.log(message)
        io.emit("message", "Hello from server")
    });

    socket.on("disconnect", () => {
        console.log("a user disconnected")
    })
});


passport.use(LocalStrategy);
passport.use(JWTStrategy);
app.use(passport.initialize());

app.get("/", (req, res) => {
    res.send("API working")
});

const chatroomRoute = require('./routes/chatroom_route');
app.use('/chatroom',  passport.authenticate('jwt', {session: false}), chatroomRoute);

const authRoute = require('./routes/auth_route');
app.use('/auth', authRoute);

const PORT = process.env.PORT || '4000';

server.listen(PORT, () => {console.log(`listening on port ${PORT}`)})