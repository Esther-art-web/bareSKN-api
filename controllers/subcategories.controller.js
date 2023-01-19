const Category = require("../models/category.model");
const { Product } = require("../models/product.model");
const SubCategory = require("../models/subcategory.model");
const APIFeatures = require("../utils/apiFeatures");
const { filterDefinedFields } = require("../utils/validatorCleanup");
 
exports.createSubcategory = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const subcategory = await SubCategory.create(data.validInput);
        res.status(201).json(subcategory);
    }catch(err){
        err.error = "bad request";
        next(err);
    }
}

exports.getAllSubcategories = async(req, res, next) => {
    try{
        const subcategories = new APIFeatures(SubCategory.find(), req.query)
            .filter()
            .search()
            .sort()
            .paginate()
        res.json({
            subcategories: await subcategories.query,
            totalLength: await SubCategory.countDocuments()
        })
    }catch(err){
        next(err)
    }
}

exports.getSubcategoryByCategoryKey = async(req, res, next) => {
    try{
        const { category_key } = req.params;

        const category = await Category.findOne({key: category_key});
        const subcategories = await SubCategory.find({category_key}).sort("key")

        res.json({category: category.name, subcategories});
    }catch(err){
        err.error = "not found";
        next(err);
    }
}

exports.getProductsBySubcategory = async(req, res, next) => {
    try{
        const { subcat_key } = req.params;
        const subcategory = await SubCategory.findOne({key: subcat_key});
        const products = await Product.find({subcat_keys: subcat_key}).sort("name");

        res.json({
            subcategory: subcategory.name,
            products, 
            totalProducts: products.length
        })
    }catch(err) {
        err.error = "not found";
        next(err);
    }
}

exports.updateSubcategory = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const _id = req.params.id;

        const filtered_data = filterDefinedFields(data.validInput);

        let subcategory = await SubCategory.findById(_id) 

        if(!subcategory) throw Error();

        Object.keys(filtered_data).forEach(async(data) => subcategory[data] = filtered_data[data])
        
        await subcategory.save();

        res.json({message: "Subategory updated successfully"});
    }catch(err){
        err.error = "not found";
        next(err);
    }
}

exports.deleteSubcategory = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const _id = req.params.id;
        const subcategory = await SubCategory.findByIdAndDelete(_id);

        if(!subcategory) throw Error();

        res.json({message: "Subcategory deleted successfully"})

    }catch(err){
        err.error = "not found";
        next(err);
    }
}