const express = require("express");
const app = express();
const cors = require('cors')

require('dotenv').config();
const db = require('./db');

const passport = require('passport');
const LocalStrategy = require('./config/passport/local-strategy');
const JWTStrategy = require('./config/passport/jwt')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

passport.use(LocalStrategy);
passport.use(JWTStrategy);
app.use(passport.initialize());

const chatroomRoute = require('./routes/chatroom_route');
app.use('/chatroom',  passport.authenticate('jwt', {session: false}), chatroomRoute);

const authRoute = require('./routes/auth_route');
app.use('/auth', authRoute);

const PORT = process.env.PORT || '4000';

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)})