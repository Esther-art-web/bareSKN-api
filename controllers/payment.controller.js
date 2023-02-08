const dotenv = require("dotenv");
dotenv.config();
const request = require("request");
const { paystack } = require("../utils/paystack");
const { initializePayment, verifyPayment } = paystack(request)


const { BARESKN_APP } = process.env;
exports.payWithPaystack =({form}, req, res, next) => {
    
    form.amount *= 100;

    initializePayment(form, (error, body)=>{
        if(error){
            //handle errors
            error.e_message ="Error occured while processing payment"
            return next(error);
        }
        response = JSON.parse(body);
        const redirectUrl = response.data.authorization_url;
        res.json({redirectUrl})
    });
}

exports.callbackFromPaystack = (req, res, next) => {
    const ref = req.query.reference;

    verifyPayment(ref, (error, body) => {
        if(error){
            error.e_message = "Error occured while processing payment";
            return next(error);
        }

        response = JSON.parse(body);
        if(response.status){
            res.redirect(`${BARESKN_APP}/success`)
        }else{
            res.redirect(`${BARESKN_APP}/failure`)
        }
    })
}