const express = require('express');
const router = express.Router();
const customer=require("../controllers/CustomerController");


router.post('/register',customer.register);

router.post('/login',customer.login);

module.exports=router;
 