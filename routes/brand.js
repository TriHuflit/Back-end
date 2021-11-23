const express = require('express');
const router = express.Router();
const brand = require("../controllers/BrandController");




router.get('/:slug',brand.detail);

router.get('/',brand.index);




module.exports=router;