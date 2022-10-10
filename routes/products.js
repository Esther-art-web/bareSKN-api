const express = require("express");
const Product = require("../models/product");

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
productsRouter.post('/', async (req, res, next) => {
    const {name, description, price,
        image_link, subcat_keys, coll_keys} = req.body;
   
    try{
        if(name && description && price && 
            image_link && subcat_keys && coll_keys){
            const product = new Product(req.body);
            await product.save();
            res.status(201).send(product);
        }else{
            throw new Error();
        }
    }catch(err) {
        err.type = "bad request";
        next(err);
    }
})

// Get all products or
// Get first five products with the highest rating or
// Get product(s) by search
// Paginate result
productsRouter.get('/', async(req, res, next) => {
    var {limit, page, rating, search_term} = req.query;
    if(limit && page){
        var products = await Product.find({}).sort({name: 1});
        var totalLength = products.length;
        limit = parseInt(limit);
        page = parseInt(page);
        startPage = (page - 1) * limit;
        endPage = startPage + limit;
        products = products.slice(startPage, endPage);
        try{
            if(products.length){
                res.send({products, totalLength, limit});
            }else{
                throw new Error();
            }
        }catch (err) {
            err.type = "not found";
            next(err);
        }
    }else if(rating){
        try{
            var products = await Product.find({}).sort({rating: -1});
            products = shuffle(products);
            products = products.slice(0, 5);
            res.send({products});
        }
        catch(err){
            err.type = "not found";
            next(err);
        }
    }else if(search_term){
        try{
            var products = await Product.find({name: {$regex: search_term, $options: 'i'}}).sort({name: 1}).exec();
            products = products.slice(0, 5);
            res.send({products});
        }catch(err){
            err.type = "not found";
            next(err);
        }
    }
    
})

// Get product by id
productsRouter.get('/:id', async(req, res, next) => {
    const _id = req.params.id;
    try{
        const product = await Product.findOne({_id})
        if(!product){
            throw new Error()
        }
        res.send(product)
    }catch(error){
        error.type = "not found";
        next(error);
    }
});

// Update product details
productsRouter.patch('/:id', async(req, res, next) => {
    const _id = req.params.id;
    const {name, description, price, rating, 
        image_link, subcat_keys, coll_keys} = req.body;
    try{
        if(name|| description|| price|| rating|| 
            image_link|| subcat_keys|| coll_keys){
            const updated_product = await Product.updateOne({_id}, {
                $set: req.body
            });
            if(updated_product.modifiedCount){
                res.send({success: "Product successfully updated!"});
            }else{
                throw new Error();
            }
        }else{
            const err = new Error()
            err.type = "bad request";
            next(err);
        }
        
    }catch(err) {
        err.type = "not found";
        next(err);
    }
    
})

// Delete a product
productsRouter.delete('/:id', async(req, res, next) => {
    const _id = req.params.id;
    try{
        const product = await Product.findOneAndDelete({_id});
        if(product){
            res.send({success: "Product successfully deleted!"});
        }
        throw new Error();
    }catch(err) {
        err.type = "not found";
        next(err);
    }
})


module.exports = {productsRouter};