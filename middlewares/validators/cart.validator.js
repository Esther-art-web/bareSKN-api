const Joi = require("joi");

const updateCartSchema = Joi.object({
    cartItems: Joi.array()
        .items(Joi.object({
            _id: Joi.string()
                .min(1)
                .trim()
                .required()
                .messages({
                    'any.required': `Cart item must have an id`
                }),

            name: Joi.string()
                .min(1)
                .trim()
                .required().messages({
                    'any.required': `Cart item must have a name`
                }),

            image_link: Joi.string()
                .min(1)
                .trim()
                .required()
                .messages({
                    'any.required': `Cart item must have an image_link`
                }),

            price: Joi.number()
                .required()
                .messages({
                    'any.required': `Cart item must have a price`
                }),
            quantity: Joi.number()
                .default(1),
        })),

    cleared: Joi.boolean()
}) 
    


exports.validateUpdateCart = async(data, req, res, next) => {
        const { cartItems, cleared } = req.body;
        try{
            if(data.error) return next(data);

            const user = data
            const validInput = await updateCartSchema.validateAsync({ cartItems, cleared});
            next({user, validInput});
            return;
        }catch(err){
             err.error = "bad request"
             next(err);
        }
}