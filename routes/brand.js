const express = require('express');
const router = express.Router();
const brand = require("../controllers/BrandController");




router.get('/detail/:slug',brand.detail);

router.get('/search/:brand', brand.getProductsByBrand);

router.get('/create',brand.create);

router.put('/update/:id',brand.update);

router.delete('/delete/:id',brand.detele);

router.get('/edit/:slug',brand.edit);

router.post('/store',brand.store);

router.get('/',brand.index);




module.exports=router;