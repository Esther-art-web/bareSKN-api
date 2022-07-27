const {Schema, model} = require("mongoose");
// const {Schema, model} = mongoose


const userSchema = new Schema({
    name: {
        type: String
    }
})

const collectionSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    image_link: {
        type: String,
        required: true
    }
})

const categorySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    }
})

const subCategorySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    category_key: {
        type: String,
        required: true
    }
})

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    rating:{
        type: Number,
        require: false,
        default: 0
    },
    image_link: {
        type: String,
        required: true
    },
    subcat_keys: {
        type: [String],
        required: true
    },
    coll_keys: {
        type: [String],
        required: true
    }
})

const User = model('User', userSchema)
const Collection = model('Collection', collectionSchema)
const Category = model('Category', categorySchema)
const SubCategory = model('SubCategory', subCategorySchema)
const Product = model('Product', productSchema);


module.exports = {User, Collection, Category, SubCategory, Product};