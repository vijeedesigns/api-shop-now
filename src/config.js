// Import the mongoose module
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

// Set up default mongoose connection
const mongoDB = "mongodb+srv://vijeeshnarayanan:mzBDCASoMMRWSAcu@cluster0.91snu5i.mongodb.net/elixr-labs-react-training?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = db;
