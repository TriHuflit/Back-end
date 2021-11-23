const express = require('express');
const router = express.Router();

const subcategory =require("../controllers/SubCategoryController");



router.get('/:slug',subcategory.getBrandByIdSub);
//subcategory
router.get('/detail/:slug',subcategory.detail);

router.get('/',subcategory.index);





module.exports=router;