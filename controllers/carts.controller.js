const { Cart } = require("../models/cart.model");
const { filterDefinedFields } = require("../utils/validatorCleanup");

exports.createCart = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);
        
        const cart_details={
            owner_id: data._id,
            cartItems: [],
            amount: 0,
            total: 0
        }

        const cart = await Cart.create(cart_details);
        res.status(201).json(cart);
    }catch(err){
        err.error = "bad request";
        next(err);
    }
}

exports.getAllCarts = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const {_id} = data;

        const carts = await Cart.find({owner_id: _id}).sort("-id");

        if(!carts) throw Error;

        res.json(carts)

    }catch(err){
        err.error = "not found";
        next(err);
    }
}

exports.getCartById = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const {id} = req.params
        const {_id: owner_id} = data;
        const cart = await Cart.findOne({owner_id, _id: id});

        if(!cart) throw Error;

        res.json(cart)

    }catch(err){
        err.error = "not found";
        next(err);
    }
}

exports.updateCart = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const { id:_id } = req.params;
        const  owner_id  = data.user._id;

        const filtered_data = filterDefinedFields(data.validInput);
        const { cartItems, cleared } = filtered_data;

        let amount = 0;
        let total = 0;

        let cart = await Cart.findOne({_id, owner_id});

        if(!cart) throw Error();

        if(cartItems && cartItems.length){
            cartItems.forEach((item) => {
                amount += (item.quantity * item.price);
                total += 1;
            })

            cart.cartItems = cartItems;
            cart.amount = amount;
            cart.total = total;
        }

        if(cleared) cart.cleared = cleared;

        await cart.save();
        res.json(cart);

    }catch(err){
        err.error = "not found";
        next(err);
    }
}

exports.deleteCart = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const _id = req.params.id;
        const cart = await Cart.findByIdAndDelete(_id);

        if(!cart) throw Error();

        res.json({message: "Cart deleted successfully"})

    }catch(err){
        err.error = "not found";
        next(err);
    }
}