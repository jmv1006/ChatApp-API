const con = require("../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const joi = require("joi");
const sanitize = require('express-sanitizer');


exports.get_specific_user = async (req, res) => {
    con.query(`SELECT * FROM Users WHERE Id="${req.params.userId}" OR Username="${req.params.userId}" `, (err, result) => {
        if (err) {
          console.log(err);
        }

        if(result.length === 0) {
            return res.status(400).json("User does not exist")
        }

        const user = {
            Id: result[0].Id,
            Username: result[0].Username,
            DisplayName: result[0].DisplayName
        }
        res.status(200).json(user);
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
            return res.status(400).send("User Already Exists")
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

exports.update_user = (req, res) => {
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
    });

    const { error } = schema.validate(req.body, {abortEarly: false})

    if(error) {
        res.status(400).json("Error Updating User")
        return
    };

    con.query(`UPDATE Users SET DisplayName = "${req.body.displayname}", Username = "${req.body.username}" WHERE Id = "${req.params.userId}"`, (err, result) => {
        if(err) {
            return res.status(500).json("Server Error")
        }

        res.status(200).json("Successfully Updated User")
    })
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
        const token = jwt.sign({user: tokenUser}, secret, {expiresIn: '15m'})
    
        return res.status(200).cookie('token', token, {httpOnly: true, sameSite: 'strict', secure: true}).json({
            message: 'Auth Passed',
            user: tokenUser,
        })
    })(req, res)
}

exports.check_if_session_valid = (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if(err) {
            return res.status(400).json('Error Authenticating Token')
        }

        if(!user) {
            return res.status(401).json("Token Expired")
        }

        const userObj = {
            id: user.Id,
            username: user.Username,
            displayname: user.DisplayName
        }

        res.status(200).json({
            message: "Session Valid",
            user: userObj
        })
    })(req, res)
};

exports.log_out = (req, res) => {
    res.clearCookie("token").status(200).json("Successfully Logged Out");
};


exports.test_sanitizer = (req, res) => {
    const sanitized = req.sanitize(req.body.min)
    res.send(sanitized)
};