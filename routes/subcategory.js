const express = require('express');
const router = express.Router();

const subcategory =require("../controllers/SubCategoryController");

router.get('/create',subcategory.create);

router.post('/store',subcategory.store);

router.get('/search/:subcate', subcategory.getProductsBySub);

router.put('/update/:id',subcategory.update);

router.delete('/delete/:id',subcategory.detele);

router.get('/edit/:slug',subcategory.edit);

router.get('/brand/:id',subcategory.getBrandByIDSub);

router.get('/detail/:slug',subcategory.detail);

router.get('/:slug',subcategory.getBrandBySlugSub);
//subcategory

router.get('/',subcategory.index);





module.exports=router;