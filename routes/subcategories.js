const express = require("express");
const { Product, Category, SubCategory } = require('../models');

const subCategoriesRouter = express.Router();

// Get all the subcategories
subCategoriesRouter.get('/', async(req, res, next) => {
    const subCategories = await SubCategory.find({});
    try{
        res.send(subCategories)
    }catch(err){
        err.type = "internal server error";
        next(err);
    }
})

// Get all subcategories by category key
subCategoriesRouter.get('/:category_key', async(req, res, next) => {
    const { category_key } = req.params;
    const category = await Category.find({key: category_key});
    const subCategories = await SubCategory.find({category_key});
    try {
        res.send({
            category : category[0].name,
            subCategories
        });
    }catch(err) {
        err.type = "not found";
        next(err);
    }
})

// Get products by subcategory
subCategoriesRouter.get('/:subcat_key/products', async(req, res, next) => {
    const { subcat_key } = req.params;
    const subCategory = await SubCategory.find({key: subcat_key});
    const products = await Product.find({subcat_keys: subcat_key}).sort({name: 1});
    try {
        res.send({
            subCategory : subCategory[0].name,
            products,
            totalProducts: products.length
        });
    }catch(err) {
        err.type = "not found";
        next(err);
    }
});

// Create new subcategory
subCategoriesRouter.post('/', async(req, res, next) => {
    const {name, key, category_key} = req.body;
   
    try{
        if(name && key && category_key){
            const subCategory = new SubCategory(req.body);
            await subCategory.save();
            res.send(subCategory)
        }else{
            throw new Error();
        }
    } catch(err) {
        err.type = "bad request";
        next(err);
    }
})

// Delete a subcategory
subCategoriesRouter.delete('/:id', async(req, res, next) => {
    const _id = req.params.id;
    try{
        const subCategory = await SubCategory.findOneAndDelete({_id});
        if(subCategory){
            res.send({success: "SubCategory successfully deleted!"});
        }
        throw new Error();
    }catch(err) {
        err.type = "not found";
        next(err);
    }
})

module.exports = {subCategoriesRouter};
