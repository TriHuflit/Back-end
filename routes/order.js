const express = require("express");
const Router = express.Router();
const OrderController = require("../controllers/OrderController");

Router.get("/staff", OrderController.index);

Router.get("/staff/statistical", OrderController.getStati);

Router.get("/staff/statistical/:id", OrderController.getDetailStati);

Router.post("/staff/confirm/:id", OrderController.confirm);
Router.post("/user/cancel/:id", OrderController.cancel);

Router.get("/staff/detail/:id", OrderController.getDetailOrderStaff);

Router.get("/user/all/:id", OrderController.getOrders);

Router.get("/user/detail/:id", OrderController.getDetailOrder);

Router.post("/user/store", OrderController.store);

module.exports = Router;
