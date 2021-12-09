const express = require("express");
const router = express.Router();
const category = require("../controllers/CategoryController");

//category
router.get("/subcategory/:id", category.getSubByIDCate);

router.get("/search/:slug", category.getProductsByCate);

router.get("/detail/:slug", category.detail);

router.post("/store", category.store);

router.get("/edit/:slug", category.edit);

router.put("/update/:id", category.update);

router.delete("/delete/:id", category.detele);

router.get("/:slug", category.getSubBySlugCate);

router.get("/", category.index);

module.exports = router;
