const express = require("express");
const Router = express.Router();
const OrderController = require("../controllers/OrderController");

Router.get("/staff", OrderController.index);

Router.post("/staff/comfirm/:id", OrderController.comfirm);

Router.post("/user/store", OrderController.store);

module.exports = Router;
