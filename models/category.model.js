const {Schema, model} = require("mongoose");

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


const Category = model('Category', categorySchema);

module.exports = Category;