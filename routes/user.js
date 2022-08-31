const express = require('express');
const { User } = require('../models');

const usersRouter = express.Router();

usersRouter.post('/', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send(user)
    }catch (err) {
        res.status(400).send(err)
    }
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({});

    try{
        res.send(users);
    }catch(err){
        res.status(404).send(err)
    }
})

module.exports = {usersRouter};