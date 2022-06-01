const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const con = require('../../db');

module.exports = new LocalStrategy((username, password, done) => {  
    con.query(`SELECT * FROM Users WHERE Username = "${username}"`, (err, result) => {
        if (err) {
          return done(err)
        }

        if (result.length == 0) {
            return done(null, false, { message: "Incorrect Username" });
        }

        if(result.length > 0) {
            bcrypt.compare(password, result[0].Password, (err, res) => {
                if(res) {
                    return done(null, result[0])
                }
                return done(null, false, { message: "Incorrect Password" })
            })
        }
    });
})