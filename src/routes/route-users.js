require("../config");
const express = require("express");
const RouteUsers = express.Router();
const UserModel = require("../models/model-user");
const { response200, response403 } = require("../helpers/responses");
const { generateGuid } = require("../utils");
const { validateTokenThen } = require("../helpers/jwt");
const { USER_TYPES } = require("../constants");
const { decipher } = require("./route-auth");

const getUserDetailsFromId = (guid) => {
    return UserModel.findOne({ guid });
};

// list user route
RouteUsers.get("/list", (req, res) => {
    validateTokenThen(req, res, ({ userId = null, type = 0 }) => {
        if (type === USER_TYPES.ADMIN) {
            if (userId) {
                UserModel.find({}).then((data) => {
                    if (data) {
                        response200(res, `User list`, {
                            data,
                        });
                    } else {
                        response403(res, `Something went wrong!`);
                    }
                });
            } else {
                response403(res, `Something went wrong!`);
            }
        } else {
            response403(res, `Not authorized!`);
        }
    });
});

// add user route
RouteUsers.post("/add", (req, res) => {
    validateTokenThen(req, res, ({ userId = null, type = 0 }) => {
        if (type === USER_TYPES.ADMIN) {
            if (userId) {
                const {
                    name,
                    username,
                    password,
                    status,
                    resetId,
                    resetValidTo,
                    type = 2,
                } = req.body;
                UserModel.findOne({ username }).then((found) => {
                    if (found) {
                        response403(res, `User already exists!`);
                    } else {
                        const { encryption } = decipher({ password });
                        const guid = generateGuid();
                        UserModel.create({
                            guid,
                            name,
                            username,
                            password: encryption,
                            status,
                            resetId,
                            resetValidTo,
                            type,
                        }).then((document) => {
                            if (document) {
                                response200(res, `User added`, {
                                    data: {
                                        guid,
                                        name,
                                        username,
                                        status,
                                        type,
                                    },
                                });
                            } else {
                                response403(res, `User not added!`);
                            }
                        });
                    }
                });
            } else {
                response403(res, `Something went wrong!`);
            }
        } else {
            response403(res, `Not authorized!`);
        }
    });
});

// delete user route
RouteUsers.delete("/remove", (req, res) => {
    validateTokenThen(req, res, ({ userId = null, type = 0 }) => {
        if (type === USER_TYPES.ADMIN) {
            if (userId) {
                const { guid } = req.body;
                UserModel.deleteOne({ guid, userId }).then((result) => {
                    if (result && result?.deletedCount > 0) {
                        response200(res, `Purchase deleted!`, {});
                    } else {
                        response403(res, `Something went wrong!`);
                    }
                });
            } else {
                response403(res, `Something went wrong!`);
            }
        } else {
            response403(res, `Not authorized!`);
        }
    });
});

module.exports = { RouteUsers, getUserDetailsFromId };
