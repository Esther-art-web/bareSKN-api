const express = require('express');
const { User } = require('../models');

const usersRouter = express.Router();

const hashPassword = () => {

}

usersRouter.post('/', async(req, res) => {
    const { first_name, last_name, email, address,
        phone_number, password } = req.body
    
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
        res.status(400).send(err)
    }
})

usersRouter.get('/', async (req, res) => {
    console.log(req.body)
    const users = await User.find({...req.body});
    try{
        if(users.length){
            res.send(users);
        }else{
            throw new Error();
        }
    }catch(err){
        res.status(404).send(err)
    }
})

module.exports = {usersRouter};