const Collection = require("../models/collection.model");
const { Product } = require("../models/product.model");
const { productsRouter } = require("../routes/products.route");
const { filterDefinedFields } = require("../utils/validatorCleanup");

exports.createCollection = async(data, req, res, next) => {
    try{
        if (data.error) return next(data);

        const { validInput} = data;

        const collection = await Collection.create(validInput);
        res.status(201).json(collection);

    }catch(err){
        err.error = "bad request";
        next(err)
    }
}

exports.getAllCollections = async(req, res, next) => {
    const collections = await Collection.find({});
    try{
        res.status(200).json(collections);
    }catch(err){
        err.type = "internal server error";
        next(err);
    }
}

exports.getCollectionByKey = async(req, res, next) => {
    const { key } = req.params;
    try{
        const collection = await Collection.findOne({key});

        if(!collection) throw Error();

        res.json(collection);
    }catch(err){
        err.error = "not found"
        next(err);
    }
}

exports.getProductsByCollection = async(req, res, next) => {
    const { coll_key } = req.params;
    try{
        const collection = await Collection.findOne({key: coll_key});
        const products = await Product.find({coll_keys: coll_key}).sort("name");

        if(!collection && !products.length) throw Error();

        res.json({collection: collection.name, products})
    }catch(err){
        err.error = "not found";
        next(err);
    }

}

exports.updateCollection = async(data, req, res, next) => {
    try{
        if(data.error) return next(error);
        const _id = req.params.id;

        const filtered_data = filterDefinedFields(data.validInput);

        let collection = await Collection.findById(_id) 

        if(!collection) throw Error();

        Object.keys(filtered_data).forEach(async(data) => collection[data] = filtered_data[data])
        
        await collection.save();

        res.json({message: "Collection updated successfully"});
        return;
    }catch(err){
        err.error = "not found";
        next(err);
    }
}

exports.deleteCollection = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const _id = req.params.id;
        const collection = await Collection.findByIdAndDelete(_id);

        if(!collection) throw Error();

        res.json({message: "Collection deleted successfully"})

    }catch(err){
        err.error = "not found";
        next(err);
    }
}