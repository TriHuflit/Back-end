const NewsController = require("../controllers/NewsController");
const express = require("express");
const router = express.Router();

router.get("/", NewsController.index);

router.get("/:slug", NewsController.detail);

router.post("/store", NewsController.store);

router.delete("/delete/:slug", NewsController.delete);

router.get("/edit/:slug", NewsController.edit);

router.put("/update/:slug", NewsController.update);

module.exports = router;
