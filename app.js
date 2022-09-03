const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require('./schema/schema');
const { productsRouter } = require("./routes/products");
const { collectionsRouter } = require("./routes/collections");
const { categoriesRouter } = require("./routes/categories");
const { subCategoriesRouter } = require("./routes/subcategories");
const { cartRouter } = require("./routes/cart");
const { usersRouter } = require("./routes/user");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const {DATABASE_USERNAME, 
    DATABASE_PASSWORD, 
    DATABASE_CLUSTER, 
    DATABASE_NAME,
    NODE_ENV,
    DATABASE_DEV_URL,
    DATABASE_TEST_URL
} = process.env;

let dbURL;

if (process.env.NODE_ENV ==='test'){
  dbURL = DATABASE_TEST_URL
}
else if (process.env.NODE_ENV ==='development'){
  dbURL = DATABASE_DEV_URL
}


// mongoose.connect(
//     `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`,
//   {
//     useNewUrlParser: true,
//     // useFindAndModify: false,
//     useUnifiedTopology: true
//   }
// );

mongoose.connect(
  dbURL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
}
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(cors({origin: '*'}))
// app.use(Router, graphqlHTTP({
//   schema
// }));
app.use(express.json())
app.use('/api/v1.0/products', productsRouter);
app.use('/api/v1.0/collections', collectionsRouter);
app.use('/api/v1.0/categories', categoriesRouter);
app.use('/api/v1.0/subcategories', subCategoriesRouter);
app.use('/api/v1.0/carts', cartRouter);
app.use('/api/v1.0/users', usersRouter);

// Error handling using middleware
app.use((error, req, res, next) => {
  console.log(error.type);
  switch(error.type){
    case "not found":
      res.status(404).send({
        statusCode: "404",
        message: "Resource not found"
      })
      break;
    case "bad request":
      res.status(400).send({
        statusCode: "400",
        message: "Bad Request"
      })
      break;
    case "internal server error":
      res.status(500).send({
        statusCode: "500",
        message: "Internal Server Error"
      })
      break;
    default:
      console.log("Error not handled");
  }
  next();
})


app.get('/api/v1.0/', (req, res) => {
  res.send('Welcome to BareSKN');
})

app.listen(PORT, console.log(`Server is running in port ${PORT}`));

module.exports = app;
