const express = require('express');
const { User } = require('../models');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const usersRouter = express.Router();

const hashPassword = () => {

}

const generateJWT =(data) => {
    const jwt_secret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(data, jwt_secret);
    return token;
}

const get_token_from_header =(header, next) => {
    if("authorization" in header){
        console.log("Authorization in header");
        const jwt_secret = process.env.JWT_SECRET_KEY;
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
        console.log("Authorization not in header")
    }
}

const verify_jwt = (token) => {
    console.log(token)
}

usersRouter.post('/', async(req, res, next) => {
    const { first_name, last_name, email, address,
        phone_number, password } = req.body;
    
    try {
        if(first_name && last_name && email && address &&
            phone_number && password){
            const user = new User(req.body);
            await user.save();
            res.status(201).send(user);
        }else{
            throw new Error();
        }
    }catch (err) {
        err.type = "bad request";
        next(err);
    }
})

usersRouter.post('/login', async (req, res, next) => {
    const {email, password} = req.body;
    
    try{
        if(email && password) {
            // Validate user
            const user = await User.findOne({...req.body});
            // Generate JWT
            const token = generateJWT(req.body);
            if(user){
                res.send({
                    user,
                    token
                });
            }else{
                throw new Error();
            }
        }else{
            let err = new Error();
            err.type = "bad request";
            next(err);
        }
        
    }catch(err){
        err.type = "not found";
        next(err);
    }
})

usersRouter.get('/verify_jwt', (req, res, next) => {
    const header = req.headers;
    const token = get_token_from_header(header, next);
    if(token){
        verify_jwt(token);
    }
})

module.exports = {usersRouter};