const NewsController = require("../controllers/NewsController");
const express = require("express");
const router = express.Router();

router.put("/update/:slug", NewsController.update);

router.post("/store", NewsController.store);

router.delete("/delete/:slug", NewsController.delete);

router.get("/:slug", NewsController.detail);

router.get("/", NewsController.index);

module.exports = router;
