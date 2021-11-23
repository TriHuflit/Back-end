const express = require('express');
const router = express.Router();
const category=require("../controllers/CategoryController");


//category
router.get('/:slug',category.getSubByIdCate);
router.get('/detail/:slug',category.detail);
router.get('/',category.index);


module.exports=router;