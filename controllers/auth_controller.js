const con = require("../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

exports.get_users = (req, res) => {
    con.query(`SELECT * FROM Users`, (err, result) => {
        if (err) {
          console.log(err);
        }
        res.status(200).json(result);
    });
};

exports.create_user = (req, res) => {
    con.query(`SELECT * FROM Users WHERE Username = "${req.body.username}"`, (err, result) => {
        if (err) {
          console.log(err);
          return
        }
        
        if(result.length > 0) {
            //user exists
            return res.status(400).send("User already exists")
        }

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if(err) {
                // error hashing password
                return
            }
            con.query(`INSERT INTO Users (Id, Username, Password) VALUES ("${uuidv4()}", "${req.body.username}", "${hashedPassword}")`, (err, result) => {
                if (err) {
                  console.log(err);
                  return
                }
                res.status(200).json("Successfully Created User");
            });
        })
    });
}
