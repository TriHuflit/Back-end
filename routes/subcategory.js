const express = require('express');
const router = express.Router();

const subcategory =require("../controllers/SubCategoryController");




//subcategory
router.get('/:id',subcategory.getSubbyIdCate);

router.get('/',subcategory.index);





module.exports=router;