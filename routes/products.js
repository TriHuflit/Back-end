const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const authorize = require("../middleware/authorize");
const store = require("../middleware/multer");

router.get("/search", productController.getProductsByKey);

router.delete("/delete/:id", productController.delete);

router.get('/getCatFoods', productController.getCatFoods);

router.get('/getDogFoods', productController.getDogFoods);

router.get("/sortDate", productController.getProductsBySortTime);

router.get("/sortPrice/:slug", productController.getProductsBySortPrice);

const uploadImage = store.fields([
  { name: "imageRepresent", maxCount: 1 },
  { name: "listImage", maxCount: 4 },
]);


router.post("/store", uploadImage, productController.store);

router.put("/update/:slug", productController.update);

router.get("/:slug", productController.detail);

router.get("/", productController.index);

module.exports = router;
