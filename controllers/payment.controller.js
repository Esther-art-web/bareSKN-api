const request = require("request");
const { paystack } = require("../utils/paystack");
const { initializePayment, verifyPayment } = paystack(request)

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
        const data = response.data;
        // console.log(data)
        const { reference, amount, customer } = data;
        const { email } = customer;
        res.json({
            success: true,
            ref: reference,
            message: `${amount} transferred successfully. Receipt sent to ${email}.`
        })
    })
}