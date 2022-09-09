const express = require('express');
const { User, Cart } = require('../models');

const cartRouter = express.Router();

// Get all cart items of a user
cartRouter.get('/:owner_id', async( req, res, next) => {
    const {owner_id} = req.params;
    try{
        const cart = await Cart.findOne({owner_id}).sort({_id: -1});
        if(cart){
            res.send(cart);
        }else{
            throw new Error();
        }
        
    }catch(err) {
        err.type = "not found";
        next(err);
    }
})

// Create a new cart for user
cartRouter.post('/:owner_id', async(req, res, next) => {
    const {owner_id} = req.params;
    try{
        const owner = await User.findById(owner_id);
        if(owner){
            const cart_details={
                owner_id,
                cartItems: [],
                amount: 0,
                total: 0
            }
            const cart = new Cart(cart_details);
            await cart.save();
            res.status(201).send({success: "Cart Successfully created!"});
        }else{
            const err = new Error();
            err.type = "not found";
            next(err);
        }
    }catch(err){
        err.type = "bad request";
        next(err);
    }
})

// Update cart of a user
cartRouter.patch('/:owner_id', async(req, res, next) => {
    const { owner_id } = req.params;
    const {cartItems, amount, total, cleared} = req.body;
    try{
        if(cartItems || amount || total || cleared){
            const { id } = req.body;
            const cart = await Cart.updateOne({_id: id, owner_id}, {
                $set: {...req.body}
            });
            if(cart.modifiedCount){
                res.send(cart);
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

module.exports = { cartRouter };