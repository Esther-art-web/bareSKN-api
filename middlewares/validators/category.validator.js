const Joi = require("joi");

const categorySchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required(),

    key: Joi.string()
        .min(1)
        .trim()
        .required()
}) 

const updateCategorySchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .trim(),

    key: Joi.string()
        .min(1)
        .trim()
}) 
    


exports.validateCreateCategory = async(data, req, res, next) => {
    const { name, key } = req.body;
    
    try{
        if(data.error) return next(data);
        const validInput = await categorySchema.validateAsync({ name, key });
        next({user: data, validInput});
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}

exports.validateUpdateCategory = async(data, req, res, next) => {
        const { name, key } = req.body;
        try{
            if(data.error) return next(data);

            const user = data
            const validInput = await updateCategorySchema.validateAsync({name, key});
            next({user, validInput});
            return
        }catch(err){
             err.error = "bad request"
             next(err);
        }
}