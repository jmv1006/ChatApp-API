const con = require("../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const joi = require("joi");

exports.get_users = (req, res) => {
    con.query(`SELECT * FROM Users`, (err, result) => {
        if (err) {
          console.log(err);
        }
        res.status(200).json(result);
    });
};

exports.get_specific_user = (req, res) => {
    con.query(`SELECT * FROM Users WHERE Id="${req.params.userId}" OR Username="${req.params.userId}" `, (err, result) => {
        if (err) {
          console.log(err);
        }

        if(result.length === 0) {
            return res.status(400).json("User does not exist")
        }
        
        res.status(200).json(result);
    });
};

exports.create_user = (req, res) => {
    const schema = joi.object({
        username: joi.string()
            .email()
            .min(3)
            .max(30)
            .required(),
        displayname: joi.string()
            .min(3)
            .max(30)
            .required(),
        password: joi.string()
            .min(3)
            .required(),
        confirmedpassword: joi.string()
            .min(3)
            .valid(joi.ref('password'))
            .required()
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) {
        res.status(400).json("Error Signing Up")
        return
    };

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
            con.query(`INSERT INTO Users (Id, Username, DisplayName, Password) VALUES ("${uuidv4()}", "${req.body.username}", "${req.body.displayname}", "${hashedPassword}")`, (err, result) => {
                if (err) {
                  console.log(err);
                  return
                }
                res.status(200).json("Successfully Created User")
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
            username: user.Username,
            displayname: user.DisplayName
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
