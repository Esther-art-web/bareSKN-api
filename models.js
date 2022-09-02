const {Schema, model} = require("mongoose");


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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

const cartSchema = new Schema({
    owner_id: {
        type: String,
        required: true
    },
    cartItems: {
        type: [Object],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    cleared: {
        type: Boolean,
        default: false
    }
})

const User = model('User', userSchema);
const Cart = model('cart', cartSchema);
const Collection = model('Collection', collectionSchema);
const Category = model('Category', categorySchema);
const SubCategory = model('SubCategory', subCategorySchema);
const Product = model('Product', productSchema);


module.exports = {User, Cart, Collection, Category, SubCategory, Product};