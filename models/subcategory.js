const {Schema, model} = require("mongoose");

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


const SubCategory = model('SubCategory', subCategorySchema);

module.exports = SubCategory;