const Joi = require("joi");

const subcategorySchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required(),

    key: Joi.string()
        .min(1)
        .trim()
        .required(),

    category_key: Joi.string()
        .min(1)
        .trim()
        .required()
}) 

const updateSubcategorySchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .trim(),

    key: Joi.string()
        .min(1)
        .trim(),

    category_key: Joi.string()
        .min(1)
        .trim()
}) 
    


exports.validateCreateSubcategory = async(data, req, res, next) => {
    const { name, key, category_key } = req.body;
    
    try{
        if(data.error) return next(data);
        
        const validInput = await subcategorySchema.validateAsync({ name, key, category_key });
        next({user: data, validInput});
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}

exports.validateUpdateSubcategory = async(data, req, res, next) => {
        const { name, key, category_key } = req.body;
        try{
            if(data.error) return next(data);

            const user = data;
            const validInput = await updateSubcategorySchema.validateAsync({name, key, category_key});
            next({user, validInput});
            return
        }catch(err){
             err.error = "bad request"
             next(err);
        }
}