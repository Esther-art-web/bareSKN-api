const express = require('express');
const mongoose = require("mongoose");
const { User, Cart } = require('../models');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");


dotenv.config();

const usersRouter = express.Router();

// const generateRandom

const hashPassword = () => {

}

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
        err.type = "bad request";
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

usersRouter.post("/guest", async(req, res, next) => {
    const id = mongoose.Types.ObjectId();
    const id_part_01 = id.toString().slice(0, 6);
    const id_part_02 = id.toString().slice(18);
    // Generate JWT
    email = `guest${id}@example.com`;
    password = `${id_part_01}guest${id_part_02}`;
    const token = generateJWT({
        email,
        password
    });
   try{
        const guest = {
            first_name: "Guest",
            last_name: "Guest",
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

usersRouter.get('/verify_jwt', async(req, res, next) => {
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

usersRouter.delete("/:id", async( req, res, next) => {
    const id = req.params.id;
    try{
        const user = await User.findByIdAndDelete(id);
        const user_cart = await Cart.findOneAndDelete({owner_id: id});
        if(user){
            res.send(user);
        }else{
            throw new Error();
        }
    }catch(err){
        err.type="not found";
        next(err);
    }
})

module.exports = {usersRouter};