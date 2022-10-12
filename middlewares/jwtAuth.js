const User = require("../models/user")
require("dotenv").config();
const jwt = require("jsonwebtoken");

const get_token_from_header =(header, next) => {
    if("authorization" in header){
        const header_parts = header['authorization'].split(' ');
        if(header_parts.length === 2){
            if(header_parts[0] === "Bearer"){
                return header_parts[1]
            }else{
                let err = new Error();
                err.type = "bad request";
                next(err);
            }
        }else{
            let err = new Error();
            err.type = "bad request";
            next(err);
        }
    }else{
        let err = new Error();
        err.type = "unauthenticated";
        next(err);
    }
}

const verify_jwt = (token, next) => {
    const token_duration_milliseconds = 3600000;
    const jwt_secret = process.env.JWT_SECRET_KEY;
    const verified = jwt.verify(token, jwt_secret);
    const current_time = Date.now();
    const expiry_date = new Date(verified.date).getTime() + token_duration_milliseconds;
    if(expiry_date >= current_time){
        return verified;
    }else{
        let err = new Error();
        err.type = "unauthorized";
        next(err);
    }
}

const jwtAuth = async(req, res, next) => {
    const header = req.headers;
    const token = get_token_from_header(header, next);
    if(token){
        const data = verify_jwt(token, next);
        if(data) {
            const { email, password } = data;
                        const user = await User.findOne({ email, password });
if(user){
                next();
            }
        }else{
            let err = new Error()
            err.type = "unauthorized";
            next(err);
        }
    }else{
        let err = new Error()
        err.type = "bad request";
        next(err);
    }
}

module.exports = { get_token_from_header, verify_jwt, jwtAuth };