const crypto = require("crypto");

const algorithm = "aes-256-ccm";
const key = crypto.randomBytes(256 / 8);
const iv = "TestText";
const secretKey =
    "4B6250655368566D57638792F423F4528482B4D6250655368971337336763979";

const nonce =
    "facd38f6d36fdca38aee599e41303c907372ee8c57840e08e52905c71d3ccf3e";
const tag = "2d5a29c55130c51330d5b33d31a23913";

const USER_TYPES = {
    ADMIN: 1,
    USER: 2,
};

module.exports = { algorithm, key, iv, secretKey, nonce, tag, USER_TYPES };
