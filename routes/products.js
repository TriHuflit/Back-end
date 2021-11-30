const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const verifyToken = require('../middleware/auth');
const store =require('../middleware/multer');

router.get('/search', productController.getProductsByKey);

router.get('/sortDate', productController.getProductsBySortTime);

router.get('/sortPrice', productController.getProductsBySortPrice);

const uploadImage=store.fields([{name:'imageRepresent',maxCount:1},{name:'listImage',maxCount:4}])

router.post('/store', uploadImage, productController.store);

router.get('/:slug', productController.detail);

router.get('/:brand', productController.getProductsByBrand);

router.put('/:slug', productController.update);

router.get('/', productController.index);


module.exports = router;