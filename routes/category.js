const express = require('express');
const router = express.Router();
const category=require("../controllers/CategoryController");


//category
router.get('/',category.index);


module.exports=router;