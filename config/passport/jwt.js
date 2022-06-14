const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const con = require('../../db');

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['token']
    }
    return token
};

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor])
opts.secretOrKey = process.env.TOKEN_SECRET;

module.exports = new JwtStrategy(opts, (payload, done) => {
    con.query(`SELECT * FROM Users WHERE Id="${payload.user.id}"`, (err, result) => {
        if(err) {
            //error connecting to db
        }
        if(!result) {
            return done(null, false)
        }
        return done(null, result[0])
    });
});