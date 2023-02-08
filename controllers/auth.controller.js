const jwt = require("jsonwebtoken")
const { User } = require("../models/user.model");
require("dotenv").config()

const { JWT_SECRET_KEY } = process.env

const generateJWT= (data) => {
    const payload = {
        _id: data._id,
        email: data.email
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '12h' });
    return token;
}

exports.signupUser = async(data, req, res, next) => {
    try{
        if(data.error){
            next(data); 
            return;
        }
        const user = await User.create(data);
        const token = generateJWT(user);
        res.status(201).send({user, token});
        return;
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}

exports.signinUser = async(req, res, next) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email})
        const validPassword = await user.isValidPassword(password)
        if(!validPassword){
            let err = {}
            err.error="unauthenticated";
            err.e_message="Incorrect password, try again!"
            next(err)
            return
        }
        const token = generateJWT(user);
        res.send({ user, token });
    } catch(err) {
        err.error = "not found";
        next(err)
    }
}

exports.signinGuestUser = async(req, res, next) => {

   try{
        email = `guest${Math.ceil(Math.random() * 100)}@example.com`;
        password = `${Math.random() * 10}guest${Math.random() * 10}`;

        const guest = {
            first_name: "Guest",
            last_name: "User",
            email,
            password,
            address: "World Wide Web",
            phone_number: "+2345678964321",
            type: "guest"
        }
        const user = await User.create(guest);
        // Generate JWT
        const token = generateJWT(user);

        res.status(201).send({ user, token });
    }catch(err){
        err.error = "internal server error";
        next(err);
    }
}

exports.verifyJWT = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const user = data;
        const token = generateJWT(user);

        res.send({ user, token });

    }catch(err){
        err.error = "unauthenticated";
        next(err);
    }
}

// Change password 
// When the previous password has not been forgotten
exports.changePassword = async (data, req, res, next) => {
    try{
        if(data.error){
            next(data);
            return
        }
        const { user, validInput } = data;
        const { password, new_password } = validInput;

        const validPassword = await user.isValidPassword(password);

        if(!validPassword){
            let error = new Error();
            error.error = "unauthenticated";
            next(error);
            return;
        }

        user.password = new_password;
        await user.save();

        res.json({message: "Password has been updated"})
    } catch(err) {
        next(err);
    }
}

// Change password
// When the previous password has been forgotten
exports.resetPassword = async(req, res, next) => {

}
