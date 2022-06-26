const express = require("express");
const app = express();
const cors = require("cors");
const cookieparser = require('cookie-parser');
const expressSanitizer = require('express-sanitizer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

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
	max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);

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

module.exports = app;