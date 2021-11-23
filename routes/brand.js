const express = require('express');
const router = express.Router();
const brand = require("../controllers/BrandController");




router.get('/:id',brand.getBrandbyIdSub);

router.get('/',brand.index);




module.exports=router;