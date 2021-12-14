const express = require("express");
const Router = express.Router();
const OrderController = require("../controllers/OrderController");

Router.post("/user/store", OrderController.store);

module.exports = Router;
