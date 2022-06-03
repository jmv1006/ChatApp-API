const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const con = require('../../db');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

module.exports = new JwtStrategy(opts, (payload, done) => {
    con.query(`SELECT * FROM Users WHERE Id="${payload.user.id}"`, (err, user) => {
        if(err) {
            //error connecting to db
        }
        if(!user) {
            return done(null, false)
        }
        return done(null, user)
    });
})