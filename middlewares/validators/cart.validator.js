const Joi = require("joi");

const cartSchema = Joi.object({
    cartItems: Joi.array()
        .items(Joi.object())
        .required(),

    cleared: Joi.boolean()
        .default(false)
}) 

const updateCartSchema = Joi.object({
    cartItems: Joi.array()
        .items(Joi.object())
}) 
    


exports.validateCreateCart = async(data, req, res, next) => {
    const { owner_id, amount, total, cartItems, cleared } = req.body;
    try{
        if(data.error) return next(data);

        const validInput = await cartSchema.validateAsync({ owner_id, amount, total, cartItems, cleared });
        next({user: data, validInput});
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}

exports.validateUpdateProduct = async(data, req, res, next) => {
        const { owner_id, amount, total, cartItems, cleared } = req.body;
        try{
            if(data.error) return next(data);

            const user = data
            const validInput = await updateCartSchema.validateAsync({owner_id, amount, total, cartItems, cleared});
            next({user, validInput});
            return;
        }catch(err){
             err.error = "bad request"
             next(err);
        }
}