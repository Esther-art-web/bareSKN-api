const { Cart } = require("../models/cart.model");
const { User } = require("../models/user.model");
const { filterDefinedFields } = require("../utils/validatorCleanup");


exports.updateUser = async(data, req, res, next) => {
    const { user, validInput, error } = data;
    try{
        // Data contains a type field only when returning an error
        if(error) return next(data);
        
         // filter out the field(s) that are not undefined
         let filtered_input = filterDefinedFields(validInput);

         const updatedUser = await User.findByIdAndUpdate({_id: user._id}, {$set: filtered_input});
         if(updatedUser){
             res.json({message: "User updated successfully"})
             return;
         }
    }catch(err){
        next(err);
    }
}

exports.deleteUser = async(data, req, res, next) => {
        try{
            if(data.error) return next(data);

            const id = data._id
            const user = await User.findByIdAndDelete(id);

            // delete cart related to user and delete
            await Cart.findOneAndDelete({owner_id: id});

            if(user){
                res.json({message: "User successfully deleted"});
            }else{
                throw new Error();
            }
        }catch(err){
            err.type="not found";
            next(err);
        }
    
}