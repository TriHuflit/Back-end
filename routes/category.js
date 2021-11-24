const express = require('express');
const router = express.Router();
const category=require("../controllers/CategoryController");


//category
router.get('/:slug',category.getSubByIdCate);

router.get('/detail/:slug',category.detail);

router.post('/store',category.store);

router.get('/edit/:slug',category.edit);

router.put('/update/:id',category.update);

router.delete('/delete/:id',category.detele);

router.get('/',category.index);


module.exports=router;