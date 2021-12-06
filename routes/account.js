const express = require("express");
const router = express.Router();
const customer = require("../controllers/CustomerController");

router.get("/customer", customer.indexUser);

router.post("/staff/store", customer.store);

router.put("/staff/update/:id", customer.update);

router.delete("/staff/delete/:id", customer.delete);

router.get("/staff", customer.indexStaff);

module.exports = router;
