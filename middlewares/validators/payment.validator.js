const Joi = require("joi");

const paymentSchema = Joi.object({
    email: Joi.string()
        .email({minDomainSegments: 2, tlds: { allow: ["com", "net"]}})
        .trim()
        .required(),
    amount: Joi.number()
        .required()
})


exports.validatePayment = async(req, res, next) => {
    const { email, amount } = req.body;
    try{
        const form = await paymentSchema.validateAsync({ email, amount });
        next({form});
    }catch(err){
        err.error = "bad request"
        next(err);
    }
}