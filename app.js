const express = require("express");
const app = express();
require('dotenv').config();
const db = require('./db');

const passport = require('passport');
const LocalStrategy = require('./config/passport/local-strategy');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(LocalStrategy);
app.use(passport.initialize());

const messagesRoute = require('./routes/messages_route');
app.use('/messages', messagesRoute);

const authRoute = require('./routes/auth_route');
app.use('/auth', authRoute);

const PORT = process.env.PORT || '4000';

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)})