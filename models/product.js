const {Schema, model} = require("mongoose");


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


const Product = model('Product', productSchema);
module.exports = Product
