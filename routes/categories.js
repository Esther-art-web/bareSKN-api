const express = require('express');
const Category = require("../models/category");

const categoriesRouter = express.Router();

// Get all categories
categoriesRouter.get('/', async(req, res, next) => {
    const categories = await Category.find({});
    try{
        res.send(categories)
    }catch(err){
        err.type = "internal server error";
        next(err);
    }
})

// Create new category
categoriesRouter.post('/', async(req, res, next) => {
    const {name, key} = req.body;
    
    try{
        if(name && key){
            const category = new Category(req.body)
            await category.save();
            res.status(201).send(category);
        }else{
            throw new Error();
        }
    } catch(err) {
        err.type = "bad request";
        next(err);
    }
})

// Update a category
categoriesRouter.patch('/:id', async(req, res, next) => {
    const _id = req.params.id;
    const {name} = req.body;
    try{
        if(name){
            const category = await Category.findByIdAndUpdate({_id}, 
                {$set: req.body})
            if(category.modifiedCount){
                res.send({success: "Category updated successfully!"})
            }
            throw new Error();
        }else{
            const err = new Error();
            err.type = "bad request";
            next(err);
        }
    }catch(err){
        err.type = "not found";
        next(err);
    }
})

// Delete a category
categoriesRouter.delete('/:id', async(req, res, next) => {
    const _id = req.params.id;
    
    try{
        const category = await Category.findByIdAndDelete({_id});
        if(category){
            res.send(category);
        }
        throw new Error();
    }catch(err){
        err.type = "not found";
        next(err);
    }
})

module.exports = { categoriesRouter };