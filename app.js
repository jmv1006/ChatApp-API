const express = require("express");
const app = express();
const db = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({response: "API Working"})
});

const messagesRoute = require('./routes/messages_route');
app.use('/messages', messagesRoute);

const authRoute = require('./routes/auth_route');
app.use('/auth', authRoute);

const PORT = process.env.PORT || '4000';

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)})