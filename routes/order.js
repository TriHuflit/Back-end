const express = require("express");
const Router = express.Router();
const OrderController = require("../controllers/OrderController");

Router.get("/staff", OrderController.index);

Router.get("/staff/statistical", OrderController.getStati);

Router.get("/staff/statistical/:id", OrderController.getDetailStati);

Router.post("/staff/confirm/:id", OrderController.confirm);

Router.post("/user/store", OrderController.store);

module.exports = Router;
