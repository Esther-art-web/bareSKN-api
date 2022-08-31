const express = require('express');
const { Product, Collection } = require('../models');

const collectionsRouter = express.Router();

// Get all the collections 
collectionsRouter.get('/', async(req, res) => {
    const collections = await Collection.find({});
    try{
        res.status(200).send(collections);
    }catch(err){
        res.status(404).send(err);
    }
})

// Get collection by key
collectionsRouter.get('/:key', async (req, res) => {
    const { key } = req.params;
    const collection = await Collection.find({key})
    try{
        res.send(collection);
    }catch(err){
        res.status(404).send(err);
    }
})
// Get products by collection
collectionsRouter.get('/:coll_key/products', async(req, res) => {
    const { coll_key } = req.params;
    const collection = await Collection.find({key: coll_key});
    const products = await Product.find({coll_keys: coll_key}).sort({name: 1});
    try{
        res.send({
            collection: collection[0].name,
            products
        })
    }catch(err){
        res.status(404).send(err);
    }
})

// Create new collection
collectionsRouter.post('/', async(req, res) => {
    const collection = new Collection(req.body)
    try{
        await collection.save();
        res.status(201).send(collection)
    } catch(err) {
        res.status(500).send(err);
    }
})

// Update a collection
collectionsRouter.patch('/:id', async(req, res) => {
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
        }
        res.status(400).send();
    }catch(err){
        res.status(404).send();
    }
})

// Delete a collection
collectionsRouter.delete('/:id', async(req, res) => {
    const _id = req.params.id;
    try{
        const collection = await Collection.findByIdAndDelete(_id);
        if(collection){
            res.send({success: "Collection deleted successfully!"})
        }
        throw new Error()
    }catch(err){
        res.status(404).send(err);
    }
})


module.exports = {collectionsRouter};