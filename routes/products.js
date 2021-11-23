const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const verifyToken = require('../middleware/auth');
const store =require('../config/cloudinary.config');

router.get('/search', productController.getProductsByKey);

router.get('/sortDate', productController.getProductsBySortTime);

router.get('/sortPrice', productController.getProductsBySortPrice);

router.get('/:slug', productController.detail);

router.get('/:brand', productController.getProductsByBrand);

router.post('/store', store.single('imageRepresent'), productController.store);

router.put('/:slug', verifyToken, productController.update);

router.get('/', productController.index);


module.exports = router;