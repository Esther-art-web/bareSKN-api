const Joi = require("joi");

const collectionSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required(),

    key: Joi.string()
        .min(1)
        .trim()
        .required(),

    image_link: Joi.string()
        .required()
}) 

const updateCollectionSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .trim(),

    key: Joi.string()
        .min(1)
        .trim(),

    image_link: Joi.string()
}) 
    


exports.validateCreateCollection = async(data, req, res, next) => {
    const { name, key, image_link } = req.body;
    
    try{
        if(data.error) return next(data);
        const validInput = await collectionSchema.validateAsync({ name, key, image_link });
        next({user: data, validInput});
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}

exports.validateUpdateCollection = async(data, req, res, next) => {
        const { name, key, image_link } = req.body;
        try{
            if(data.error) return next(data);

            const user = data
            const validInput = await updateCollectionSchema.validateAsync({name, key, image_link});
            next({user, validInput});
            return
        }catch(err){
             err.error = "bad request"
             next(err);
        }
}