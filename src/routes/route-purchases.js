require("../config");
const express = require("express");
const RoutePurchases = express.Router();
const PurchaseModel = require("../models/model-purchase");
const { response200, response403 } = require("../helpers/responses");
const { generateGuid } = require("../utils");
const { validateTokenThen } = require("../helpers/jwt");
const { USER_TYPES } = require("../constants");

// list purchase route
RoutePurchases.get("/list", (req, res) => {
    validateTokenThen(req, res, ({ userId = null, type = 0 }) => {
        if (userId) {
            PurchaseModel.aggregate([
                {
                    $match:
                        type === USER_TYPES.ADMIN
                            ? {}
                            : {
                                  userId,
                              },
                },
                {
                    $lookup: {
                        from: "table-products",
                        localField: "productId",
                        foreignField: "guid",
                        as: "productDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$productDetails",
                        preserveNullAndEmptyArrays: true, // Keeps documents that don't match in the result
                    },
                },
                {
                    $lookup: {
                        from: "table-users",
                        localField: "userId",
                        foreignField: "guid",
                        as: "userDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$userDetails",
                        preserveNullAndEmptyArrays: true, // Keeps documents that don't match in the result
                    },
                },
            ])
                .exec()
                .then((result) => {
                    const data = result?.map(
                        ({
                            guid,
                            userId,
                            count,
                            status,
                            productDetails,
                            userDetails,
                        }) => {
                            const userDetailsData =
                                type === USER_TYPES.ADMIN
                                    ? {
                                          userDetails: {
                                              guid: userId,
                                              name: userDetails?.name,
                                              type: userDetails?.type,
                                          },
                                      }
                                    : {};
                            return {
                                guid,
                                count,
                                status,
                                productDetails: {
                                    guid: productDetails?.guid,
                                    name: productDetails?.name,
                                    details: productDetails?.details,
                                    image: productDetails?.image,
                                    count: productDetails?.count,
                                    rating: productDetails?.rating,
                                    status: productDetails?.status,
                                },
                                ...userDetailsData,
                            };
                        }
                    );
                    response200(res, `Purchase list`, {
                        data,
                    });
                });
        } else {
            response403(res, `Something went wrong!`);
        }
    });
});

// add purchase route
RoutePurchases.post("/add", (req, res) => {
    validateTokenThen(req, res, ({ userId = null }) => {
        if (userId) {
            const { productId, count, status } = req.body;
            const guid = generateGuid();
            PurchaseModel.create({
                guid,
                userId,
                productId,
                count,
                status,
            }).then((document) => {
                if (document) {
                    response200(res, `Purchase added`, {
                        data: {
                            guid,
                            productId,
                            count,
                            status,
                        },
                    });
                } else {
                    response403(res, `Purchase not added!`);
                }
            });
        } else {
            response403(res, `Something went wrong!`);
        }
    });
});

// edit purchase route
RoutePurchases.post("/edit", (req, res) => {
    validateTokenThen(req, res, ({ userId = null }) => {
        if (userId) {
            const { guid, productId, count, status } = req.body;
            PurchaseModel.findOne({ userId, guid }).then((foundGuid) => {
                if (foundGuid) {
                    PurchaseModel.updateOne(
                        { guid, userId },
                        {
                            $set: {
                                productId,
                                count,
                                status,
                            },
                        }
                    ).then((document) => {
                        if (document) {
                            response200(res, `Purchase updated`, {
                                data: {
                                    guid,
                                    productId,
                                    count,
                                    status,
                                },
                            });
                        } else {
                            response403(res, `Purchase not updated!`);
                        }
                    });
                } else {
                    response403(res, `Purchase not exists!`);
                }
            });
        } else {
            response403(res, `Something went wrong!`);
        }
    });
});

// delete purchase route
RoutePurchases.delete("/remove", (req, res) => {
    validateTokenThen(req, res, ({ userId = null }) => {
        if (userId) {
            const { guid } = req.body;
            PurchaseModel.deleteOne({ guid, userId }).then((result) => {
                if (result && result?.deletedCount > 0) {
                    response200(res, `Purchase deleted!`, {});
                } else {
                    response403(res, `Something went wrong!`);
                }
            });
        } else {
            response403(res, `Something went wrong!`);
        }
    });
});

module.exports = { RoutePurchases };
