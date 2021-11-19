const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const verifyToken = require('../middleware/auth');
router.get('/search', productController.getProductsByKey);

router.get('/sortDate', productController.getProductsBySortTime);

router.get('/sortPrice', productController.getProductsBySortPrice);

router.get('/:brand', productController.getProductsByBrand);

router.post('/store', verifyToken, productController.store);

router.put('/:id', verifyToken, productController.update);

router.get('/', productController.index);


module.exports = router;