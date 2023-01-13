const { get_token_from_header, verify_jwt } = require('./jwtAuth');
const User = require('../models/user');

const adminAuth = async(req, res, next) => {
    const header = req.headers;
    const token = get_token_from_header(header, next);
    if(token){
        const header = req.headers;
        const token = get_token_from_header(header, next);
        const data = verify_jwt(token, next);
        if(data) {
            const { email, password } = data;
            const user = await User.findOne({ email, password, role: 1 });
            if(user){
                next();
            }
        }
    }
}

module.exports = adminAuth;