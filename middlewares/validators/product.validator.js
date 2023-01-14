const Joi = require("joi");

const productSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required(),

    description: Joi.string()
        .min(1)
        .trim()
        .required(),

    price: Joi.number()
        .required(),

    rating: Joi.number()
        .valid(1, 2, 3, 4, 5)
        .default(0),

    image_link: Joi.string()
        .required(),

    subcat_keys: Joi.array()
        .items(Joi.string().trim())
        .required(),

    coll_keys: Joi.array()
        .items(Joi.string().trim())
        .required()
}) 

const updateProductSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .trim(),

    description: Joi.string()
        .min(1)
        .trim(),

    price: Joi.number(),

    rating: Joi.number()
        .valid(1, 2, 3, 4, 5),

    image_link: Joi.string(),

    subcat_keys: Joi.array()
        .items(Joi.string().trim()),

    coll_keys: Joi.array()
        .items(Joi.string().trim())
}) 
    


exports.validateCreateProduct = async(data, req, res, next) => {
    const { name, description, price, rating, image_link, subcat_keys, coll_keys } = req.body;
    try{
        if(data.error) return next(data);
        const validInput = await productSchema.validateAsync({ name, description, price, rating, image_link, subcat_keys, coll_keys });
        next({user: data, validInput});
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}

exports.validateUpdateProduct = async(data, req, res, next) => {
        const { name, description, price, rating, image_link, subcat_keys, coll_keys } = req.body;
        try{
            if(data.error) return next(data);

            const user = data
            const validInput = await updateProductSchema.validateAsync({name, description, price, rating, image_link, subcat_keys, coll_keys});
            next({user, validInput});
            return
             
             
        }catch(err){
             err.error = "bad request"
             next(err);
        }
}