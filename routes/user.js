const express = require('express');
const Cart = require("../models/cart");
const User = require("../models/user");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");


dotenv.config();

const usersRouter = express.Router();
const SALT_ROUNDS=10;



const generateJWT =(data) => {
    data.date = Date.now();
    const jwt_secret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(data, jwt_secret);
    return token;
}

usersRouter.get('/', async(req, res, next) => {
    const { email, password } = req.body;
    
    // try {
    //     if(email && password){
    //         // Generate token
    //         // bcrypt.hash(password, SALT_ROUNDS).then(function(hash){
    //         //     console.log("hash", hash)
    //         //     return hash;
    //         // });
    //         const token = generateJWT({email, password});
    //         const user = new User(req.body);
    //         await user.save();
    //         res.status(201).send({user, token});
    //     }else{
    //         throw new Error();
    //     }
    // }catch (err) {
    //     err.type = "bad request";
    //     next(err);
    // }
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