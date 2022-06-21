const mysql = require('mysql');
const dbConfig = require('./config/db.config');

let con; 

if(process.env.NODE_ENV == "development") {
    const dbTestConfig = require('./config/db.test.config');
    con = mysql.createConnection({
        host: dbTestConfig.host,
        port: dbTestConfig.port,
        user: dbTestConfig.user,
        password: dbTestConfig.password,
        database: dbTestConfig.database
    });
} else {
    con = mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database
    });
};

con.connect((err) => {
    if(err) {
        console.log(err)
        return
    }
    
    console.log('Successfully Connected to DB')
});

module.exports = con;