const express = require('express');
const { Product, Collection } = require('../models');

const collectionsRouter = express.Router();

// Get all the collections 
collectionsRouter.get('/', async(req, res, next) => {
    const collections = await Collection.find({});
    try{
        res.status(200).send(collections);
    }catch(err){
        err.type = "internal server error";
        next(err);
    }
})

// Get collection by key
collectionsRouter.get('/:key', async (req, res, next) => {
    const { key } = req.params;
    const collection = await Collection.find({key})
    try{
        if(collection.length){
            res.send(collection);
        }else{
            throw new Error();
        }
    }catch(err){
        err.type = "not found";
        next(err);
    }
})
// Get products by collection
collectionsRouter.get('/:coll_key/products', async(req, res, next) => {
    const { coll_key } = req.params;
    const collection = await Collection.find({key: coll_key});
    const products = await Product.find({coll_keys: coll_key}).sort({name: 1});
    try{
        if(collection && products){
            res.send({
                collection: collection[0].name,
                products
            })
        }else{
            throw new Error();
        }
    }catch(err){
        err.type = "not found";
        next(err);
    }
})

// Create new collection
collectionsRouter.post('/', async(req, res, next) => {
    const collection = new Collection(req.body)
    try{
        await collection.save();
        res.status(201).send(collection);
    } catch(err) {
        err.type = "bad request";
        next(err);
    }
})

// Update a collection
collectionsRouter.patch('/:id', async(req, res, next) => {
    const _id = req.params.id;
    const {name, key, image_link} = req.body;
    try{
        if(name || key || image_link){
            const collection = await Collection.findByIdAndUpdate({_id}, 
                {$set: req.body})
            if(collection.modifiedCount){
                res.send({success: "Collection deleted successfully!"})
            }
            throw new Error();
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

// Delete a collection
collectionsRouter.delete('/:id', async(req, res, next) => {
    const _id = req.params.id;
    try{
        const collection = await Collection.findByIdAndDelete(_id);
        if(collection){
            res.send({success: "Collection deleted successfully!"})
        }
        throw new Error()
    }catch(err){
        err.type = "not found";
        next(err);
    }
})


module.exports = {collectionsRouter};