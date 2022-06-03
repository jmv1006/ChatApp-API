const con = require("../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
};

exports.sign_in = (req, res) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err) {
            return res.status(400).json('Error Authenticating User')
        }

        if(!user) {
            return res.status(400).json("Error Signing In")
        }

        const tokenUser = {
            id: user.Id,
            username: user.Username
        }
        
        const secret = process.env.TOKEN_SECRET
        const token = jwt.sign({user: tokenUser}, secret, {expiresIn:'30m'});
    
        return res.status(200).json({
            message: 'Auth Passed',
            user: tokenUser,
            token: token
        })
    })(req, res)
}
