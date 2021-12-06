const express = require("express");
const router = express.Router();
const customer = require("../controllers/CustomerController");

router.get("/customer", customer.indexUser);

router.get("/staff/create", customer.create);

router.post("/staff/store", customer.store);

router.get("/staff/detail/:id", customer.detail);

router.get("/staff/edit/:id", customer.edit);

router.put("/staff/update/:id", customer.update);

router.delete("/staff/delete/:id", customer.delete);

router.get("/staff", customer.indexStaff);

module.exports = router;
