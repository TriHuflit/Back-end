const express = require("express");
const router = express.Router();
const customer = require("../controllers/CustomerController");

router.put("/account/update/:id", customer.updateinfo);

router.get("/", customer.indexUser);

module.exports = router;