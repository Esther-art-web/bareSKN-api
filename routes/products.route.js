const express = require("express");
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/products.controller");
const {authorizeAdmin} = require("../middlewares/authorization.middleware");
const { authenticateUser } = require("../middlewares/authentication.middleware");
const Product = require("../models/product.model");
const { validateCreateProduct, validateUpdateProduct } = require("../middlewares/validators/product.validator");

const productsRouter = express.Router();
const shuffle =(array)=> {
    length = array.length;
    for(item of array) {
        random = Math.floor(Math.random() * length);
        array[random] = item;
    }
    return array;
}

// Create new product
productsRouter.post('/', [authenticateUser, authorizeAdmin, validateCreateProduct], createProduct)

productsRouter.get('/', getAllProducts)

// Get product by id
productsRouter.get('/:id', getProductById);

// Update product details
productsRouter.patch('/:id', [authenticateUser, authorizeAdmin, validateUpdateProduct], updateProduct)

// Delete a product
productsRouter.delete('/:id',[authenticateUser, authorizeAdmin], deleteProduct)


module.exports = {productsRouter};