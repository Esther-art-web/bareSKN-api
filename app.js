const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit")
const { productsRouter } = require("./routes/products.route");
const { collectionsRouter } = require("./routes/collections.route");
const { categoriesRouter } = require("./routes/categories.route");
const { subCategoriesRouter } = require("./routes/subcategories.route");
const { cartRouter } = require("./routes/cart.route");
const  usersRouter  = require("./routes/users.route");
const { errorHandler } = require("./middlewares/error.middleware");
const authRouter = require("./routes/auth.route");
const { default: helmet } = require("helmet");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const {
  DATABASE_CONN_STR
} = process.env;

let dbURL = DATABASE_CONN_STR;

// Manage MongoDB connection
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    autoIndex: true, //make this also true
  })

mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB Successfully");
});

mongoose.connection.on("error", (err) => {
	console.log("An error occurred while connecting to MongoDB");
	console.log(err);
});

app.use(cors({origin: '*'}));
app.use(express.json())
app.use(helmet());


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use("/api/v1.0/", authRouter);
app.use('/api/v1.0/users', usersRouter)
app.use('/api/v1.0/products', productsRouter);
app.use('/api/v1.0/collections', collectionsRouter);
app.use('/api/v1.0/categories', categoriesRouter);
app.use('/api/v1.0/subcategories', subCategoriesRouter);
app.use('/api/v1.0/carts', cartRouter);
;

// Error handling middleware
app.use(errorHandler);


app.get('/api/v1.0/', (req, res) => {
  res.send('Welcome to BareSKN API Version 1.0');
})

app.listen(PORT, console.log(`Server is running in port ${PORT}`));

module.exports = app;
