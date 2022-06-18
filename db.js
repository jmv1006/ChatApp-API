const mysql = require('mysql');
const dbConfig = require('./config/db.config');

const con = mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

con.connect((err) => {
    if(err) {
        console.log(err)
        return
    }
    
    console.log('Successfully Connected to DB')
});

module.exports = con;