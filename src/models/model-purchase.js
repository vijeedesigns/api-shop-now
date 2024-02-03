// Require Mongoose
const mongoose = require("mongoose");

// Define user schema
const Schema = mongoose.Schema;

const PurchaseModel = new Schema({
    guid: { type: String, required: true },
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    count: { type: Number, required: true },
    status: { type: Number, required: false },
});

module.exports = mongoose.model("table-purchases", PurchaseModel);
