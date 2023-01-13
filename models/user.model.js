const {Schema, model} = require("mongoose");
const bcrypt = require("bcrypt");

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
    },
    type: {
        type: String,
        enum: ['registered', "guest"],
        default: "registered"
    },
    role: {
        type: Number,
        default: 2
    }
})

// Hash password before saving in the database
userSchema.pre(
    "save",
    async function(next){
        if (!this.isModified('password')) {
            next();
            return;
        }
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    }
)

// Compare input password with password in database
userSchema.methods.isValidPassword = async function(input_password){
    return await bcrypt.compare(input_password, this.password);
}

exports.User = model('User', userSchema);
