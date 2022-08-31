const express = require('express');
const { Cart } = require('../models');

const cartRouter = express.Router();

// Get all cart items of a user
cartRouter.get('/:owner_id', async( req, res) => {
    const {owner_id} = req.params;
    try{
        const cart = await Cart.findOne({owner_id}).sort({_id: -1});
        res.send(cart);
    }catch(err) {
        res.status(404).send(err)
    }
})

// Create a new cart for user
cartRouter.post('/:owner_id', async(req, res) => {
    const {owner_id} = req.params;
    try{
        if(owner_id){
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
            res.status(404).send({error: "Cart owner not found"})
        }
    }catch(err){
        res.status(500).send(err);
    }
})

// Update cart of a user
cartRouter.patch('/:owner_id', async(req, res) => {
    const { owner_id } = req.params;
    try{
        const { id } = req.body;
        const cart = await Cart.updateOne({_id: id, owner_id}, {
            $set: req.body
        });
        res.send(cart);
    }catch(err){
        res.status(400).send(err)
    }
    
})

module.exports = { cartRouter };