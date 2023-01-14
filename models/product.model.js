const {Schema, model} = require("mongoose");


const productSchema = new Schema({
    name: {
        type: String,
        unique: true,
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
        enum: [1, 2, 3, 4, 5],
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


exports.Product = model('Product', productSchema);
