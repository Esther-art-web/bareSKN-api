const express = require('express');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user")
require("dotenv").config();
const jwt = require("jsonwebtoken");


const SALT_ROUNDS=10;

const authRouter = express.Router();


const generateJWT =(data) => {
    data.date = Date.now();
    const jwt_secret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(data, jwt_secret);
    return token;
}

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

authRouter.post('/signup', async(req, res, next) => {
    let { first_name, last_name, email, address,
        phone_number, password, role } = req.body;
    
    try{
        if(first_name && last_name && email && address &&
            phone_number && password){
            // Hash password
            password = await bcrypt.hash(password, SALT_ROUNDS);
            // Generate token
            const token = generateJWT({email, password});
            const user = await User.create({first_name, last_name, email, address,
                phone_number, password, role});
            res.status(201).send({user, token});
        }else{
            throw new Error();
        }
    }catch (err) {
        err.type = "bad request";
        next(err);
    }
})

authRouter.post('/login', async (req, res, next) => {
    let {email, password} = req.body;
    
    try {
        const hashedUser = await User.findOne({email});
        if(!hashedUser){
            throw new Error();
        }
        // Compare users password to password in db
        password = await bcrypt.compare(password, hashedUser.password)
        if(!password) {
            let err = new Error();
            err.type = "unauthenticated";
            next(err);
        }
        // Validate user
        const user = await User.findOne({email, password: hashedUser.password});
        // Generate JWT
        const token = generateJWT({email, password: user.password});
        res.send({
            user,
            token
        });
    }catch(error){
        error.type = "bad request";
        next(error);
    }
})

authRouter.post("/guest", async(req, res, next) => {
    const id = mongoose.Types.ObjectId();
    const id_part_01 = id.toString().slice(0, 6);
    const id_part_02 = id.toString().slice(18);

    try{
        email = `guest${id}@example.com`;
        password = `${id_part_01}guest${id_part_02}`;
        // Hash password
        password = await bcrypt.hash(password, SALT_ROUNDS);
        // Generate JWT
        const token = generateJWT({
            email,
            password
        });
        console.log(token)
    
        const guest = {
            first_name: "Guest",
            last_name: "User",
            email,
            password,
            address: "World Wide Web",
            phone_number: "+2345678964321",
            type: "guest"
        }
        const user = new User(guest);
        await user.save();
        res.status(201).send({
            user, 
            token
        });
    }catch(err){
        err.type = "internal server error";
        next(err);
    }
})

authRouter.get('/verify_jwt', async(req, res, next) => {
    const header = req.headers;
    const token = get_token_from_header(header, next);
    try{
        if(token){
            const data = verify_jwt(token, next);
            if(data) {
                const { email, password } = data;
                const user = await User.findOne({ email, password });
                if(user){
                    res.send({
                        user,
                        token
                    });
                }else{
                    let err = new Error();
                    err.type = "not found";
                    next(err);
                }
            }
        }else{
            throw new Error();
        }
    }catch(err) {
        err.type = "unauthorized";
        next(err);
    }
})

module.exports = authRouter;