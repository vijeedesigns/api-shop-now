require("../config");
const express = require("express");
const RouteProducts = express.Router();
const ProductModel = require("../models/model-product");
const { response200, response403 } = require("../helpers/responses");
const { generateGuid } = require("../utils");
const { validateTokenThen } = require("../helpers/jwt");
const { USER_TYPES } = require("../constants");
const path = require("path");
const fs = require("fs");

// list product route
RouteProducts.get("/list", (req, res) => {
    validateTokenThen(req, res, () => {
        ProductModel.find({}).then((document) => {
            if (document) {
                response200(res, `Product list`, {
                    data: document?.map((doc) => {
                        const {
                            guid,
                            name,
                            details,
                            image,
                            count,
                            rating,
                            status,
                        } = doc;
                        return {
                            guid,
                            name,
                            details,
                            image,
                            count,
                            rating,
                            status,
                        };
                    }),
                });
            } else {
                response403(res, `Something went wrong!`);
            }
        });
    });
});

// add product route
RouteProducts.post("/add", (req, res) => {
    validateTokenThen(req, res, ({ type = null }) => {
        if (type === USER_TYPES.ADMIN) {
            const { name, details, image, imageName, count, rating, status } = req?.body;
            const filename = path.join(
                __dirname, 
                `../../assets/uploads/products`,
                imageName
            );
            fs.writeFileSync(
                filename,
                new Buffer.from(
                    image?.replace(/^data:image\/\w+;base64,/, ""),
                    "base64"
                )
            );

            const guid = generateGuid();
            ProductModel.findOne({ name }).then((found) => {
                if (found) {
                    response403(res, `Product already exists!`);
                } else {
                    ProductModel.create({
                        guid,
                        name,
                        details,
                        image: `assets/uploads/products/${imageName}`,
                        count,
                        rating,
                        status,
                    }).then((document) => {
                        if (document) {
                            response200(res, `Product added`, {
                                data: {
                                    guid,
                                    name,
                                    details,
                                    image: `assets/uploads/products/${imageName}`,
                                    count,
                                    rating,
                                    status,
                                },
                            });
                        } else {
                            response403(res, `Product not added!`);
                        }
                    });
                }
            });
        } else {
            response403(res, `Not authorized!`);
        }
    });
});

// edit product route
RouteProducts.post("/edit", (req, res) => {
    validateTokenThen(req, res, ({ type = null }) => {
        if (type === USER_TYPES.ADMIN) {
            const { guid, name, details, image, count, rating, status } =
                req.body;
            ProductModel.findOne({ guid }).then((foundGuid) => {
                if (foundGuid) {
                    ProductModel.updateOne(
                        { guid },
                        {
                            $set: {
                                name,
                                details,
                                image,
                                count,
                                rating,
                                status,
                            },
                        }
                    ).then((document) => {
                        if (document) {
                            response200(res, `Product updated`, {
                                data: {
                                    guid,
                                    name,
                                    details,
                                    image,
                                    count,
                                    rating,
                                    status,
                                },
                            });
                        } else {
                            response403(res, `Product not updated!`);
                        }
                    });
                } else {
                    response403(res, `Product not exists!`);
                }
            });
        } else {
            response403(res, `Not authorized!`);
        }
    });
});

// delete product route
RouteProducts.delete("/remove", (req, res) => {
    validateTokenThen(req, res, ({ type = null }) => {
        if (type === USER_TYPES.ADMIN) {
            const { guid } = req.body;
            ProductModel.deleteOne({ guid }).then((result) => {
                if (result && result?.deletedCount > 0) {
                    response200(res, `Product deleted!`, {});
                } else {
                    response403(res, `Something went wrong!`);
                }
            });
        } else {
            response403(res, `Not authorized!`);
        }
    });
});

module.exports = { RouteProducts };
