const express = require('express');
const router = express.Router();

const subcategory =require("../controllers/SubCategoryController");




//subcategory
router.get('/:slug',subcategory.getSubbyIdCate);

router.get('/',subcategory.index);





module.exports=router;