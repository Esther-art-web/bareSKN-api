const { get_token_from_header } = require('../utils/retrieveHeaderToken');

exports.authorizeAdmin = async(data, req, res, next) => {
    try{
        if(data.error) return next(data);

        const { role } = data;
        if(role !== 1){
            throw new Error();
        }

        const header = req.headers;
        const token = get_token_from_header(header, next);

        if(token) next(data);

    } catch(error){
        error.error = "unauthorized";
        next(error)
    }
}