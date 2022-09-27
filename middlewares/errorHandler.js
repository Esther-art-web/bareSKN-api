const errorHandler = (error, req, res, next) => {
    switch(error.type){
        case "bad request":
          res.status(400).send({
            error: "Bad Request",
            statusCode: 400,
            message: "Request cannot be fulfilled due to bad syntax"
          })
          break;
        case "unauthorized":
          res.status(401).send({
            error: "Unauthorized",
            statusCode: 401,
            message: "User is not authorized to access resource(s)"
          })
          break;
        case "not found":
          res.status(404).send({
            error: "Not Found",
            statusCode: 404,
            message: "Resource not found"
          })
          break;  
        case "internal server error":
          res.status(500).send({
            error: "Internal Server Error",
            statusCode: 500,
            message: "Server could not process request"
          })
          break;
        default:
          console.log("Error not handled");
    }
    next();
}

module.exports = { errorHandler };