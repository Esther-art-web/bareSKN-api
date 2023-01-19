const Category = require("../models/category.model");
const APIFeatures = require("../utils/apiFeatures");
const { filterDefinedFields } = require("../utils/validatorCleanup");

exports.createCategory = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);
        
        const category = await Category.create(data.validInput)
        res.status(201).json(category);
    }catch(err){
        err.error="bad request";
        next(err);
    }
}

exports.getAllCategories = async(req, res, next) => {
    try{
        const categories = new APIFeatures(Category.find(), req.query)
            .filter()
            .search()
            .sort()
            .paginate()
        res.json({
            categories: await categories.query,
            totalLength: await Category.countDocuments()
        });
        return;
    }catch(err){
        next(err)
    }
}

exports.updateCategory = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const _id = req.params.id;

        const filtered_data = filterDefinedFields(data.validInput);

        let category = await Category.findById(_id) 

        if(!category) throw Error();

        Object.keys(filtered_data).forEach(async(data) => category[data] = filtered_data[data])
        
        await category.save();

        res.json({message: "Category updated successfully"});
    }catch(err){
        err.error = "not found";
        next(err);
    }
}

exports.deleteCategory = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const _id = req.params.id;
        const category = await Category.findByIdAndDelete(_id);

        if(!category) throw Error();

        res.json({message: "Category deleted successfully"})

    }catch(err){
        err.error = "not found";
        next(err);
    }
}