const express = require('express');
const router = express.Router();
const brand = require("../controllers/BrandController");




router.get('/detail/:slug',brand.detail);

router.get('/create',brand.create);

router.post('/store',brand.store);

router.get('/',brand.index);




module.exports=router;