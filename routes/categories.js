const express = require('express');
const { Category } = require('../models');

const categoriesRouter = express.Router();

// Get all categories
categoriesRouter.get('/', async(req, res) => {
    const categories = await Category.find({});
    try{
        res.send(categories)
    }catch(err){
        res.status(404).send(err);
    }
})

// Get category by key
categoriesRouter.get('/:key', async (req, res) => {
    return;

})

// Create new category
categoriesRouter.post('/', async(req, res) => {
    const category = new Category(req.body)
    try{
        await category.save();
        res.status(201).send(category);
    } catch(err) {
        res.status(500).send(err);
    }
})

// Update a category
categoriesRouter.patch('/:id', async(req, res) => {
    const _id = req.params.id;
    const {name, key} = req.body;
    try{
        if(name || key ){
            const category = await Category.findByIdAndUpdate({_id}, 
                {$set: req.body})
            if(category.modifiedCount){
                res.send({success: "Category updated successfully!"})
            }
            throw new Error();
        }
        res.status(400).send();
    }catch(err){
        res.status(404).send();
    }
})

// Delete a category
categoriesRouter.delete('/:id', async(req, res) => {
    const _id = req.params.id;
    
    try{
        const category = await Category.findByIdAndDelete({_id});
        if(category){
            res.send(category);
        }
        throw new Error();
    }catch(err){
        res.status(404).send(err);
    }
})

module.exports = { categoriesRouter };