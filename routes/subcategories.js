const express = require("express");
const { Product, Category, SubCategory } = require('../models');

const subCategoriesRouter = express.Router();

// Get all the subcategories
subCategoriesRouter.get('/', async(req, res) => {
    const subCategories = await SubCategory.find({});
    try{
        res.send(subCategories)
    }catch(err){
        res.status(404).send(err);
    }
})

// Get all subcategories by category key
subCategoriesRouter.get('/:category_key', async(req, res) => {
    const { category_key } = req.params;
    const category = await Category.find({key: category_key});
    const subCategories = await SubCategory.find({category_key});
    try {
        res.send({
            category : category[0].name,
            subCategories
        });
    }catch(err) {
        res.status(404).send(err);
    }
})

// Get products by subcategory
subCategoriesRouter.get('/:subcat_key/products', async(req, res) => {
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
        res.status(404).send(err);
    }
});

// Create new subcategory
subCategoriesRouter.post('/', async(req, res) => {
    const subCategory = new SubCategory(req.body)
    try{
        await subCategory.save();
        res.send(subCategory)
    } catch(err) {
        res.status(500).send(err);
    }
})

module.exports = {subCategoriesRouter};
