const express = require('express');
const router = express.Router();
const customer=require("../controllers/CustomerController");


router.get('/user',customer.indexUser);

router.get('/staff',customer.indexStaff);

module.exports=router;
 