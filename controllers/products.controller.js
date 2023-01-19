const { Product } = require("../models/product.model");
const APIFeatures = require("../utils/apiFeatures");
const { filterDefinedFields } = require("../utils/validatorCleanup");

exports.createProduct = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);
        const { validInput} = data;

        const product = await Product.create(validInput);
        res.status(201).json(product);
    }catch(err){
        err.error = "bad request";
        next(err);
    }
}

// Get all products or
// Get first five products with the highest rating or
// Get product(s) by search
// Paginate result
exports.getAllProducts = async( req, res, next) => {
    try{
        let products = new APIFeatures(Product.find(), req.query)
                        .filter()
                        .search()
                        .sort()
                        .paginate()
                        
        res.json({
            products: await products.query,
            totalLength: await Product.countDocuments()
        })
    }catch(err){
        err.error="not found";
        next(err);
    }
}

// Get product by Id
exports.getProductById = async(req, res, next) => {
    const _id = req.params.id;
    try{
        const product = await Product.findById(_id)
        if(!product){
            throw new Error()
        }
        res.json(product);
    }catch(error){
        error.type = "not found";
        next(error);
    }
}

exports.updateProduct = async(data, req, res, next) => {
    try {
        if(data.error) return next(data);
        
        const _id = req.params.id;
        const filtered_data = filterDefinedFields(data.validInput);

        const product = await Product.findById(_id);

        if(!product) throw Error();

        Object.keys(filtered_data).forEach(async(data) => product[data] = filtered_data[data])
        
        await product.save();

        res.json({message: "Product updated successfully"});
        return;
    }catch(err){
        err.error = "not found";
        next(err);
    }
}

exports.deleteProduct = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const _id = req.params.id;
        const product = await Product.findOneAndDelete({_id});

        if(product){
            res.send({success: "Product successfully deleted!"});
        }
    }catch(err){
        err.type = "not found";
        next(err);
    }
}