const {Schema, model} = require("mongoose");

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

const Collection = model('Collection', collectionSchema);
module.exports = Collection;
