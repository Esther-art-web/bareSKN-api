const { Router } = require("express");
const { payWithPaystack, callbackFromPaystack } =  require("../controllers/payment.controller");
const { validatePayment } = require("../middlewares/validators/payment.validator");


const paymentRouter = Router();

paymentRouter.post("/pay",validatePayment, payWithPaystack);

paymentRouter.get("/callback", callbackFromPaystack)

module.exports = { paymentRouter };