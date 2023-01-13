const { User } = require("../models/user.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const {JWT_SECRET_KEY} = process.env;

const get_token_from_header =(header, next) => {
    if("authorization" in header){
        const header_parts = header['authorization'].split(' ');
        if(header_parts.length === 2){
            if(header_parts[0] === "Bearer"){
                return header_parts[1]
            }else{
                let err = new Error();
                err.error = "bad request";
                next(err);
            }
        }else{
            let err = new Error();
            err.error = "bad request";
            next(err);
        }
    }else{
        let err = new Error();
        err.error = "unauthenticated";
        next(err);
    }
}

exports.authenticateUser = async(req, res, next) => {
    const header = req.headers;
    const token = get_token_from_header(header, next);
    try{
        if(token){
            const payload = jwt.verify(token, JWT_SECRET_KEY);
            if(payload) {
                const { _id, email } = payload;
                const user = await User.findOne({ _id, email });
                
                if(user) return next(user);
    
                throw new Error();
            }else{
                throw new Error();
            }
        }else{
            let err = new Error()
            err.error = "bad request";
            next(err);
        }
    }catch(err) {
        err.error = "unauthenticated";
        next(err);
    }
    
}
