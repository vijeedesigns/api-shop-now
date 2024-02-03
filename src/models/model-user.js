// Require Mongoose
const mongoose = require("mongoose");
const cryptoJs = require("crypto-js");

// Define user schema
const Schema = mongoose.Schema;

const UserModel = new Schema({
    guid: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: Number, required: true },
    resetId: { type: String, required: false },
    resetValidTo: { type: Date, required: false },
    type: { type: Number, required: true },
});

UserModel.methods.comparePassword = (value, nonce, user) => {
    const userPassword = cryptoJs.AES.decrypt(user.password, nonce).toString(cryptoJs.enc.Utf8);
    const valuePassword = cryptoJs.AES.decrypt(value, nonce).toString(cryptoJs.enc.Utf8);
    return userPassword === valuePassword;
};

module.exports = mongoose.model("table-users", UserModel);
