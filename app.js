const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

global.appRoot = path.resolve(__dirname);

const server = express();

// Set up Global configuration access
dotenv.config();

server.use(
    cors({
        origin: "*",
    })
);

server.use(bodyParser.json({ limit: "200mb" }));
server.use(bodyParser.text({ limit: "200mb" }));
server.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

server.use("/assets", express.static("assets"));

server.get("/", (req, res) => {
    res.send(`<div>
        <div>Hello!</div>
        <div>Welcome to Elixr Labs React Training API.</div>
        <div>V1.0.1</div>
        <div>${appRoot}</div>
    </div>`);
});

const { RouteAuth } = require("./src/routes/route-auth");
server.use("/auth", RouteAuth);

const { RouteProducts } = require("./src/routes/route-products");
server.use("/products", RouteProducts);

const { RoutePurchases } = require("./src/routes/route-purchases");
server.use("/purchases", RoutePurchases);

const { RouteUsers } = require("./src/routes/route-users");
server.use("/users", RouteUsers);

server.listen(process.env.PORT);
