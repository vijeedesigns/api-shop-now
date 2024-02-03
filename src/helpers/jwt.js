const jwt = require("jsonwebtoken");
const { response401 } = require("../helpers/responses");
const UserModel = require("../models/model-user");

const getUserDetailsFromId = (guid) => {
    return UserModel.findOne({ guid });
};

const generateToken = (userId) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId,
    };
    return jwt.sign(data, jwtSecretKey);
};

const validateToken = (req) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const token = req.header(tokenHeaderKey).replace(/bearer:/g, "");
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return verified;
        } else {
            // Access Denied
            return false;
        }
    } catch (error) {
        // Access Denied
        return false;
    }
};

const validateTokenThen = (req, res, callback = () => {}) => {
    const validate = validateToken(req);
    if (validate) {
        const { userId } = validate;
        const userDetails = getUserDetailsFromId(userId);
        userDetails.then((data) => {
            callback({ ...validate, name: data?.name, type: data?.type });
        });
    } else {
        response401(res, `Invalid token`);
    }
};

module.exports = { generateToken, validateToken, validateTokenThen };
