const Joi = require("joi");

const userSchema = Joi.object({
    first_name: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required(),
    last_name: Joi.string()
        .min(1)
        .max(255)
        .trim()
        .required(),
    email: Joi.string()
        .email({minDomainSegments: 2, tlds: { allow: ["com", "net"]}})
        .trim()
        .required(),
    address: Joi.string()
        .trim()
        .required(),
    phone_number: Joi.string()
        .required(),
    password: Joi.string()
        .trim()
        .required(),
    type: Joi.string()
        .valid("registered", "guest")
        .default("registered")
        .trim(),
    role: Joi.number()
        .valid(1, 2)
        .default(2)
}) 

const updateUserSchema = Joi.object({
    first_name: Joi.string()
        .min(3)
        .max(255)
        .trim(),
    last_name: Joi.string()
        .min(3)
        .max(255)
        .trim(),
    email: Joi.string()
        .email({minDomainSegments: 2, tlds: { allow: ["com", "net"]}}),
    address: Joi.string()
        .trim(),
    phone_number: Joi.number(),
    type: Joi.string()
        .valid("registered", "guest")
        .trim(),
    role: Joi.number()
        .valid(1, 2)
    }) 

const changePasswordSchema = Joi.object({
    password: Joi.string()
        .required(),
    new_password: Joi.string()
        .disallow(Joi.ref('password'))
        .required()
        .messages({
            'any.invalid': `new_password cannot have the same value as password`
          })
}) 
    


exports.validateCreateUser = async(req, res, next) => {
    const { first_name, last_name, email, password, address, phone_number, type, role } = req.body;
    try{
        const validInput = await userSchema.validateAsync({first_name, last_name, email, password, address, phone_number, type, role });
        next(validInput);
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}

exports.validateUpdateUser = async(data, req, res, next) => {
        const { first_name, last_name, email, address, phone_number, type, role } = req.body;
        try{
             if(!data.error){
                const user = data
                const validInput = await updateUserSchema.validateAsync({first_name, last_name, email, address, phone_number, type, role});
                next({user, validInput});
                return
             }
             next(data);
        }catch(err){
             err.error = "bad request"
             next(err);
        }
}

exports.validateChangePassword = async(data, req, res, next) => {
    const { password, new_password } = req.body;
    try{
        if(data.error){
            next(data);
            return;
        }
        const validInput = await changePasswordSchema.validateAsync({password, new_password});
        next({user: data, validInput});
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}