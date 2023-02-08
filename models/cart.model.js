const {Schema, model} = require("mongoose");

const cartSchema = new Schema({
    owner_id: {
        type: String,
        required: true,
        ref: "User"
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
}, {timestamps: true})


exports.Cart = model('cart', cartSchema);
