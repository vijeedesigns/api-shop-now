// Require Mongoose
const mongoose = require("mongoose");

// Define user schema
const Schema = mongoose.Schema;

const ProductModel = new Schema({
    guid: { type: String, required: true },
    name: { type: String, required: true },
    details: { type: String, required: true },
    image: { type: String, required: false },
    count: { type: Number, required: true },
    rating: { type: Number, required: false },
    status: { type: Number, required: false },
});

module.exports = mongoose.model("table-products", ProductModel);
