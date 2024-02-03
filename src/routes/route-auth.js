require("../config");
const crypto = require("crypto");
const cryptoJs = require("crypto-js");
const express = require("express");
const RouteAuth = express.Router();
const UserModel = require("../models/model-user");
const { generateGuid } = require("../utils");
const { generateToken, validateToken } = require("../helpers/jwt");
const { response200, response403 } = require("../helpers/responses");
const { algorithm, key, iv, secretKey, nonce, tag } = require("../constants");

const decipher = (body) => {
    const { password } = body;

    const decipher = crypto.createDecipheriv(algorithm, key, iv, {
        authTagLength: 16,
    });

    const tagBuffer = Buffer.from(tag, "hex");
    decipher.setAuthTag(tagBuffer);

    const encryption = cryptoJs.AES.encrypt(
        password,
        secretKey
    ).toString();

    return { encryption };
};

// login route
RouteAuth.post("/login", (req, res) => {
    const { username } = req.body;
    const { encryption } = decipher(req.body);
    UserModel.findOne({ username }).then((user) => {
        if (user) {
            const matching = user.comparePassword(encryption, secretKey, user);
            if (matching) {
                const { guid, name, username, type } = user;
                const jwt = generateToken(guid);
                response200(res, `User exists`, {
                    data: { guid, name, username, type },
                    jwt,
                });
            } else {
                response403(res, `Invalid credentials`);
            }
        } else {
            response403(res, `Invalid credentials`);
        }
    });
});

// signup route
RouteAuth.post("/signup", (req, res) => {
    const { username } = req.body;
    UserModel.findOne({ username }).then((found) => {
        if (found) {
            response403(res, `User already exists!`);
        } else {
            const {
                name,
                username,
                password
            } = req.body;
            const { encryption } = decipher({ password });
            const guid = generateGuid();
            UserModel.create({
                guid,
                name,
                username,
                password: encryption,
                status: 1,
                resetId: null,
                resetValidTo: null,
                type: 2,
            }).then((document) => {
                if (document) {
                    response200(res, `User added`, {
                        data: {
                            guid,
                            name,
                            username,
                            status: 1,
                            type: 2,
                        },
                    });
                } else {
                    response403(res, `User not added!`);
                }
            });
        }
    });
});

// verify token route
RouteAuth.get("/verify-token", (req, res) => {
    if (validateToken(req)) {
        response200(res, `User verified`);
    } else {
        response403(res, `Uder not verified`);
    }
});

module.exports = { RouteAuth, decipher };
