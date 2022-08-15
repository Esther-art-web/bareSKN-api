const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const Router = require("./routes");
const schema = require('./schema/schema');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const {DATABASE_USERNAME, 
    DATABASE_PASSWORD, 
    DATABASE_CLUSTER, 
    DATABASE_NAME
} = process.env;



// mongoose.connect(
//     `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`,
//   {
//     useNewUrlParser: true,
//     // useFindAndModify: false,
//     useUnifiedTopology: true
//   }
// );

mongoose.connect(
  `mongodb://localhost:27017/bareSKN`,
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
app.use(Router);

app.listen(PORT, console.log(`Server is running in port ${PORT}`))