const express = require('express');
const User = require('../models/user.model');
const Cart = require("../models/cart.model");
const { getAllCarts, createCart, getCartById, updateCart, deleteCart } = require('../controllers/carts.controller');
const { validateUpdateCart } = require('../middlewares/validators/cart.validator');
const { authenticateUser } = require('../middlewares/authentication.middleware');

const cartRouter = express.Router();

// Get all cart items of a user
cartRouter.get('/',[authenticateUser], getAllCarts);

// Get cart by Id
cartRouter.get("/:id", [authenticateUser], getCartById);

// Create a new cart 
cartRouter.post('/', [authenticateUser], createCart);

// Update cart by id
cartRouter.patch('/:id', [authenticateUser, validateUpdateCart], updateCart);

// Delete cart by id
cartRouter.delete('/:id', [authenticateUser], deleteCart);

module.exports = { cartRouter };