# BareSKN API

## Introduction
BareSKN API is a CORS enabled, RESTful API with resource-oriented URLs, accepts form encoded request bodies or variable request parameters, returns ***JSON-encoded*** responses, and uses standard HTTP response status codes and messages.\
A ***NodeJS*** application created particularly to be used in BareSKN application, an ecommerce web application for sales of skincare products, rendering of esthetic procedures , and so much more (You can check it out here -> [Link to bareSKN-app]).\
BareSKN API was created using ***Test Driven Development*** (TDD), hence you can also use this API in test mode without interacting with your main development database.

[link to postman documentation](https://documenter.getpostman.com/view/23865505/2s8YK4s7py)

- This application was built using ***Express***, a *Node.js* web application framework for craeting servers.
- Database Management done with ***Mongoose***, for object data modelling with *Node.js*.
- Environment variables were stored and managed using the ***dotenv*** package

## To start up project on your local machine.
- Fork and clone the [BareSKN-API](https://github.com/ibehesther/bareSKN-api) repository unto your local development machine.
- Open a new terminal, move into the project repository `cd bareSKN-api`
- Then, install all the required libraries using `npm install`
- Go to MongoDB Atlas and set up a database, and get a connection string
- Create a `.env` file in the root of your project folder
- Create a "DATABASE_CONN_STR" variable in the `.env` file and assign the string copied from MongoDB Atlas to it
- Go to the terminal and run `npm run dev`
- Your server should be up and running! ;)